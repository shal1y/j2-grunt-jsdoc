/**
 * The module contains the class definition for the base view controller.
 *
 * @module controllers/BaseCtrl
 * @author John Doe
 * @copyright &copy; 2017, Some Awesome Company. All Rights Reserved.
 */


/**
 * Is the base controller class for all the app views.
 *
 * @class
 * @param {object} a - is the instance of the app object
 * @tags tags45, sample
 * @example
 * <caption>What up</caption>
 * //   instantiating the controller
 * var ctrl = new BaseCtrl(app);
 * ctrl.startControlling();
 */
function BaseCtrl(a) {

	//  some init code
}


BaseCtrl.prototype  = Object.create(Object.prototype, {

	/**
	 * Returns the reference to the instance of the app object
	 *
	 * @property {object} app
	 * @readonly
	 * @memberof module:controllers/BaseCtrl~BaseCtrl
	 */
	app : {
		get : function() {
			return this._app;
		}
	},


	/**
	 * Is the resolved object for the <code>targetRef</code>. The <code>targetRef</code> is the id of the
	 * equip/site... etc, item, where the app has navigated to.
	 *
	 * @property {object} nodeItem
	 * @memberof module:controllers/BaseCtrl~BaseCtrl
	 */
	nodeItem    : {

		get : function() {
			return this._nodeItem;
		},
		set : function(value) {
			this._nodeItem  = value;
		}
	},


	/**
	 * When fetching data from the server, this property is used to keep track of what type
	 * of data is pulled. The most common action types are:
	 * <uL>
	 *     <li>K.ACTION.RESOLVE => "action_resolve" - Used when a <code>readById(<object-id>)</code> operation is being performed</li>
	 *     <li>K.ACTION.DATA => "action_data" - Used when the actual data for the app is being queried. Eg: For alarms app, when the alarms are being queried</li>
	 *     <li>K.ACTION.META => "action_meta" - Used when the <code>navMeta</code> object is being queried, or something related to it</li>
	 *     <li>K.ACTION.EXTRA => "action_extra" - Flag set when there is something custom, or other than the above described situations</li>
	 * </ul>
	 * The use of these values is all arbitrary and depends totally on the developer. The above outlined values are recommended. Here the property <code>K</code> refers
	 * to the module <code>util/const</code>
	 *
	 * @property {string} action
	 * @memberof module:controllers/BaseCtrl~BaseCtrl
	 */
	action  : {

		get : function() {
			return this._action;
		},
		set : function(value) {
			this._action    = value;
		}

	},


	/**
	 * Is the event handler when the left header button on the app header is tapped/clicked
	 *
	 * @method headerLeftBtnTapped
	 * @abstract
	 * @instance
	 *
	 * @param {object} event - Is the {@link https://github.com/rstacruz/ractive-touch|ractive-touch} event object
	 * @memberof module:controllers/BaseCtrl~BaseCtrl
	 */
	headerLeftBtnTapped : {
		//  To be implemented by the sub-classes
		//  Will throw error if not implemented
		//  and the even listener is called
	},


	/**
	 * Is the event handler when the app header right button is tapped/clicked
	 *
	 * @method headerRightBtnTapped
	 * @memberof module:controllers/BaseCtrl~BaseCtrl
	 * @instance
	 *
	 * @param {object} event - Is the <code>ractive-touch</code> event object
	 */
	headerRightBtnTapped    : {

		get : function() {

			if (!this._headerRightBtnTapped) {
				this._headerRightBtnTapped  = function(event) {

					event.original.preventDefault();

					var flag    = true;
					if (this.rightBtnTapHandler)
						flag    = this.rightBtnTapHandler(event);

					if (!flag)
						return;

					this._app.fire(K.EVENT.TOGGLE_MENU);
				}.bind(this);
			}

			return this._headerRightBtnTapped;

		}

	},


	/**
	 * Is the method called before the controller instance is to be destroyed
	 *
	 * @method cleanUp
	 * @memberof module:controllers/BaseCtrl~BaseCtrl
	 * @instance
	 */
	cleanUp : {
		get : function() {
			if (!this._cleanUp) {
				this._cleanUp   = function() {
					this._app               = null;
					this._nodeItem          = null;
					this._action            = null;
					this.rightBtnTapHandler = null;
				}.bind(this);
			}

			return this._cleanUp;
		}
	},


	/**
	 * Is the function that is called to have the app re-query the displayed data
	 *
	 * @method refreshData
	 * @memberof module:controllers/BaseCtrl~BaseCtrl
	 * @instance
	 */
	refreshData : {
		//  to be implemented by the sub-classes
	}

});


module.exports  = BaseCtrl;
