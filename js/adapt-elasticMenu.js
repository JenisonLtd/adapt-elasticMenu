define([
    'coreJS/adapt',
    'coreViews/menuView',
    'require',
    'menu/adapt-elasticMenu/js/snap.svg-min'
], function (Adapt, MenuView, require) {

    var Snap = require('menu/adapt-elasticMenu/js/snap.svg-min');

    var ElasticMenuView = MenuView.extend({

        postRender: function() {
            var nthChild = 0;
            this.model.getChildren().each(function(item) {
                if (item.get('_isAvailable')) {
                    nthChild++;
                    item.set("_nthChild", nthChild);
                    this.$('.menu-container-inner').append(new ElasticMenuItemView({ model: item }).$el);
                }
            });

            var speed = 250,
                easing = mina.backout;

            [].slice.call(document.querySelectorAll('.menu-item-inner')).forEach(function (el) {
                var svg = el.querySelector('svg');
                if (svg) {
                    var s = Snap(svg), path = s.select('path'),
                        pathConfig = {
                            from: path.attr('d'),
                            to: el.getAttribute('data-path-hover')
                        };

                    el.addEventListener('mouseenter', function () {
                        path.animate({ 'path': pathConfig.to }, speed, easing);
                    });

                    el.addEventListener('mouseleave', function () {
                        path.animate({ 'path': pathConfig.from }, speed, easing);
                    });
                }
            });
        }

    }, {
        template: 'elasticmenu'
    });

    var ElasticMenuItemView = MenuView.extend({

        events: {
            'click .menu-item-inner': 'onClickMenuItemButton'
        },

        className: function() {
            var nthChild = this.model.get("_nthChild");
            return [
                'menu-item',
                'menu-item-' + this.model.get('_id') ,
                this.model.get('_classes'),
                this.model.get('_isVisited') ? 'visited' : '',
                this.model.get('_isComplete') ? 'completed' : '',
                'nth-child-' + nthChild,
                nthChild % 2 === 0 ? 'nth-child-even' : 'nth-child-odd'
            ].join(' ');
        },

        preRender: function() {
            this.model.checkCompletionStatus();
            this.model.checkInteractionCompletionStatus();
        },

        postRender: function() {
            var graphic = this.model.get('_graphic');
            if (graphic && graphic.src && graphic.src.length > 0) {
                this.$el.imageready(_.bind(function() {
                    this.setReadyStatus();
                }, this));
            } else {
                this.setReadyStatus();
            }
        },

        onClickMenuItemButton: function(event) {
            if(event && event.preventDefault) event.preventDefault();
            Backbone.history.navigate('#/id/' + this.model.get('_id'), {trigger: true});
        }

    }, {
        template: 'elasticmenu-item'
    });

    Adapt.on('router:menu', function(model) {

        $('#wrapper').append(new ElasticMenuView({ model: model }).$el);

    });

});
