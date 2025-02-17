import {Component, OnInit, Input, ElementRef, OnDestroy, OnChanges} from '@angular/core';
import {CloudinaryImage} from '@cloudinary/url-gen/assets/CloudinaryImage';
import {
  cancelCurrentlyRunningPlugins,
  HtmlImageLayer,
  Plugins
} from '@cloudinary/html';
import {SDKAnalyticsConstants} from '../internal/SDKAnalyticsConstants';

/**
 * @mixin AngularSDK
 * @description The Cloudinary Angular SDK contains components like \<advanced-image\> to easily render your media assets from
 * Cloudinary. The SDK also comes with support for optional JS plugins that make the components smart, with features
 * like lazy loading, placeholder, accessibility & responsiveness.
 *
 * @example
 * <caption>
 *  Please note that the order of the plugins is important. See {@link https://cloudinary.com/documentation/sdks/js/frontend-frameworks/index.html#plugin-order|Plugin Order} for more details.
 * </caption>
 * // In your app.module.ts inject the library.
 * import { CloudinaryModule} from '@cloudinary/angular';
 *
 * imports: [
 *   ...,
 *   CloudinaryModule,
 * ],
 *
 * // In your component.ts use `@cloudinary/url-gen` to generate your transformations.
 * // Import the plugins you wish to use
 *
 * import {CloudinaryImage} from "@cloudinary/url-gen/assets/CloudinaryImage";
 * import {
 *  AdvancedImage,
 *  accessibility,
 *  responsive,
 *  lazyload,
 *  placeholder
 * } from '@cloudinary/angular';
 *
 * ngOnInit() {
 *   const myCld = new Cloudinary({ cloudName: 'demo'});
 *   this.img = myCld().image('sample');
 *
 *   this.plugins = [lazyload(), placeholder()]
 * }
 *
 * // In your view add the component with your transformation.
 * <advanced-image [cldImg]="this.img" [plugins]="this.plugins"></advanced-image>
 */

/**
 * @memberOf AngularSDK
 * @type {Component}
 * @description The Cloudinary image component.
 * @prop {CloudinaryImage} transformation Generated by @cloudinary/url-gen
 * @prop {Plugins} plugins Advanced image component plugins accessibility(), responsive(), lazyload(), placeholder()
 * @prop imageAttributes Optional attributes include alt, width, height, loading
 */
@Component({
  selector: 'advanced-image',
  template: `
    <img />
  `,
  styleUrls: ['./cloudinary-image.component.css']
})
export class CloudinaryImageComponent implements OnInit, OnChanges, OnDestroy {
  @Input('cldImg') cldImg: CloudinaryImage;
  @Input('plugins') plugins: Plugins;
  @Input('alt') alt: string;
  @Input('width') width: string;
  @Input('height') height: string;
  @Input('loading') loading: string;
  htmlLayerInstance: HtmlImageLayer;
  constructor(private el: ElementRef) { }

  /**
   * On init creates a new HTMLLayer instance and initializes with ref to img element,
   * user generated cloudinaryImage and the plugins to be used.
   */
  ngOnInit() {
    this.htmlLayerInstance = new HtmlImageLayer(this.el.nativeElement.children[0], this.cldImg, this.plugins, SDKAnalyticsConstants);
    this.syncAttributes();
  }

  /**
   * On update, we cancel running plugins and update the image instance with the state of user
   * cloudinaryImage and the state of plugins.
   */
  ngOnChanges() {
    if (this.htmlLayerInstance) {
      cancelCurrentlyRunningPlugins(this.htmlLayerInstance.htmlPluginState);
      this.htmlLayerInstance.update(this.cldImg, this.plugins, SDKAnalyticsConstants);
      this.syncAttributes();
    }
  }

  /**
   * On destroy, we cancel the currently running plugins.
   */
  ngOnDestroy() {
    // safely cancel running events on destroy
    cancelCurrentlyRunningPlugins(this.htmlLayerInstance.htmlPluginState);
  }

  /**
   * Add attributes to img element.
   */
  syncAttributes() {
    ['alt', 'width', 'height', 'loading'].forEach(attr => {
      if (this[attr]) {
        this.el.nativeElement.children[0].setAttribute(attr, this[attr]);
        this.el.nativeElement.removeAttribute(attr);
      }
    });
  }
}
