/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
	'use strict';

	app.PlayerView = Backbone.View.extend({
		tagName: "tr",

		events: {
			'click .toggle': 'toggleSign'
		},

		// Init by rendering.
		initialize: function (player) {
			var self = this,
				power = player.model.getPower();
			self.model = player;
			self.specials = [];
			self.specials.push( power / self.model.model.getAttributes().length);
		},

		close: function () {
			this.unbind();
			this.remove();
		},

		// Toggle the `"completed"` state of the model.
		toggleSign: function () {
			var self = this,
				html,
				currentTeam = self.model.model.attributes.teamName;

			if (currentTeam) {
				app.teams.handleSign({action: 'release', player: self.model.model});
			} else {
				app.teams.handleSign({action: 'sign', player: self.model.model});
			}

	        return this;
		},

	    render: function() {
	        var self = this,
	        	html = self.buildHtml();
	        this.$el.html(html);
	        return this;
    	},

    	buildHtml: function(){
	        var self = this,
	        	html, 
	        	obj,
	        	templ = '#row-no-button-template';

        	obj = { name: self.model.model.getName(), 
        		position: self.model.model.getPosition(),
	        	age: self.model.model.getAge(),
	        	actionText: self.model.model.getActionText(),
	        	tags: self.model.model.getAttributes(), 
	        	specials: self.specials };

	        if ( obj.actionText.length > 0) {
	        	templ = '#row-template';
	        } else {
	        	templ = '#row-no-button-template';
	        }

	        self.template = $(templ).html();
	        html = _.template(self.template, obj);
	        return html;
    	},
	});
})(jQuery);
