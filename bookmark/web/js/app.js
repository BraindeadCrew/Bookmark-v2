(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle) {
    for (var key in bundle) {
      if (has(bundle, key)) {
        modules[key] = bundle[key];
      }
    }
  }

  globals.require = require;
  globals.require.define = define;
  globals.require.brunch = true;
})();

window.require.define({"application": function(exports, require, module) {
  var Application, Chaplin, HeaderController, Layout, SessionController, mediator, routes,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  mediator = require('mediator');

  routes = require('routes');

  SessionController = require('controllers/session_controller');

  HeaderController = require('controllers/header_controller');

  Layout = require('views/layout');

  module.exports = Application = (function(_super) {

    __extends(Application, _super);

    function Application() {
      return Application.__super__.constructor.apply(this, arguments);
    }

    Application.prototype.title = 'Brunch example application';

    Application.prototype.initialize = function() {
      Application.__super__.initialize.apply(this, arguments);
      this.initDispatcher();
      this.initLayout();
      this.initMediator();
      this.initControllers();
      this.initRouter(routes);
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    Application.prototype.initLayout = function() {
      return this.layout = new Layout({
        title: this.title
      });
    };

    Application.prototype.initControllers = function() {
      new SessionController();
      return new HeaderController();
    };

    Application.prototype.initMediator = function() {
      Chaplin.mediator.user = null;
      return Chaplin.mediator.seal();
    };

    return Application;

  })(Chaplin.Application);
  
}});

window.require.define({"collections/bookmark_collection": function(exports, require, module) {
  var BookmarkModel, MainRouter,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BookmarkModel = require('models/bookmark_model').BookmarkModel;

  MainRouter = require('routers/main_router').MainRouter;

  exports.BookmarkCollection = (function(_super) {

    __extends(BookmarkCollection, _super);

    function BookmarkCollection() {
      return BookmarkCollection.__super__.constructor.apply(this, arguments);
    }

    BookmarkCollection.prototype.model = BookmarkModel;

    BookmarkCollection.prototype.initialize = function() {
      this.bind('all', function(e) {
        return console.log("BookmarkCollection", e, this);
      });
      app.collections.tags.bind('change', this.update, this);
    };

    BookmarkCollection.prototype.url = function() {
      var filters, ret;
      ret = "/bookmark/api/bookmarks/";
      filters = app.collections.tags.urlFilters();
      if (filters != null) {
        ret += filters;
      }
      return ret;
    };

    BookmarkCollection.prototype.router = MainRouter;

    BookmarkCollection.prototype.parse = function(response) {
      this.per_page = response.per_page;
      this.total = response.total;
      this.page = response.page;
      return response.bookmarks;
    };

    BookmarkCollection.prototype.update = function() {
      console.log('bookmark collection update');
      return this.fetch();
    };

    return BookmarkCollection;

  })(Backbone.Collection);
  
}});

window.require.define({"collections/tagscloud_collection": function(exports, require, module) {
  var TagModel,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  TagModel = require('models/tag_model').TagModel;

  exports.TagscloudCollection = (function(_super) {

    __extends(TagscloudCollection, _super);

    function TagscloudCollection() {
      return TagscloudCollection.__super__.constructor.apply(this, arguments);
    }

    TagscloudCollection.prototype.model = TagModel;

    TagscloudCollection.prototype.initialize = function() {
      this.bind('all', function(e) {
        return console.log("TagscloudCollection", e, this);
      });
      return this.bind('change:filter', this.update, this);
    };

    TagscloudCollection.prototype.url = function() {
      var filters, ret;
      ret = "/bookmark/api/tagcloud";
      filters = this.urlFilters();
      if ((filters != null) && filters !== "") {
        ret += '/' + filters;
      }
      return ret;
    };

    TagscloudCollection.prototype.getFiltered = function() {
      return this.filter(function(tag) {
        return tag.get('filter');
      });
    };

    TagscloudCollection.prototype.getUnfiltered = function() {
      return this.reject(function(tag) {
        return tag.get('filter');
      });
    };

    TagscloudCollection.prototype.update = function() {
      return this.fetch();
    };

    TagscloudCollection.prototype.urlFilters = function() {
      var f, filters, list;
      f = this.getFiltered();
      list = _.map(f, function(e) {
        return e.get('name');
      });
      filters = list.join('+');
      return filters;
    };

    TagscloudCollection.prototype.parse = function(response) {
      return response.tags;
    };

    return TagscloudCollection;

  })(Backbone.Collection);
  
}});

window.require.define({"controllers/base/controller": function(exports, require, module) {
  var Chaplin, Controller,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  module.exports = Controller = (function(_super) {

    __extends(Controller, _super);

    function Controller() {
      return Controller.__super__.constructor.apply(this, arguments);
    }

    return Controller;

  })(Chaplin.Controller);
  
}});

window.require.define({"controllers/header_controller": function(exports, require, module) {
  var Controller, Header, HeaderController, HeaderView, mediator,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Controller = require('controllers/base/controller');

  mediator = require('mediator');

  Header = require('models/header');

  HeaderView = require('views/header_view');

  module.exports = HeaderController = (function(_super) {

    __extends(HeaderController, _super);

    function HeaderController() {
      return HeaderController.__super__.constructor.apply(this, arguments);
    }

    HeaderController.prototype.initialize = function() {
      HeaderController.__super__.initialize.apply(this, arguments);
      this.model = new Header();
      return this.view = new HeaderView({
        model: this.model
      });
    };

    return HeaderController;

  })(Controller);
  
}});

window.require.define({"controllers/home_controller": function(exports, require, module) {
  var Controller, HomeController, HomePageView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Controller = require('controllers/base/controller');

  HomePageView = require('views/home_page_view');

  module.exports = HomeController = (function(_super) {

    __extends(HomeController, _super);

    function HomeController() {
      return HomeController.__super__.constructor.apply(this, arguments);
    }

    HomeController.prototype.historyURL = 'home';

    HomeController.prototype.index = function() {
      return this.view = new HomePageView();
    };

    return HomeController;

  })(Controller);
  
}});

window.require.define({"controllers/session_controller": function(exports, require, module) {
  var Controller, LoginView, SessionController, User, mediator,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  mediator = require('mediator');

  Controller = require('controllers/base/controller');

  User = require('models/user');

  LoginView = require('views/login_view');

  module.exports = SessionController = (function(_super) {

    __extends(SessionController, _super);

    function SessionController() {
      this.logout = __bind(this.logout, this);

      this.serviceProviderSession = __bind(this.serviceProviderSession, this);

      this.triggerLogin = __bind(this.triggerLogin, this);
      return SessionController.__super__.constructor.apply(this, arguments);
    }

    SessionController.serviceProviders = {};

    SessionController.prototype.loginStatusDetermined = false;

    SessionController.prototype.loginView = null;

    SessionController.prototype.serviceProviderName = null;

    SessionController.prototype.initialize = function() {
      this.subscribeEvent('serviceProviderSession', this.serviceProviderSession);
      this.subscribeEvent('logout', this.logout);
      this.subscribeEvent('userData', this.userData);
      this.subscribeEvent('!showLogin', this.showLoginView);
      this.subscribeEvent('!login', this.triggerLogin);
      this.subscribeEvent('!logout', this.triggerLogout);
      return this.getSession();
    };

    SessionController.prototype.loadServiceProviders = function() {
      var name, serviceProvider, _ref, _results;
      _ref = SessionController.serviceProviders;
      _results = [];
      for (name in _ref) {
        serviceProvider = _ref[name];
        _results.push(serviceProvider.load());
      }
      return _results;
    };

    SessionController.prototype.createUser = function(userData) {
      return mediator.user = new User(userData);
    };

    SessionController.prototype.getSession = function() {
      var name, serviceProvider, _ref, _results;
      this.loadServiceProviders();
      _ref = SessionController.serviceProviders;
      _results = [];
      for (name in _ref) {
        serviceProvider = _ref[name];
        _results.push(serviceProvider.done(serviceProvider.getLoginStatus));
      }
      return _results;
    };

    SessionController.prototype.showLoginView = function() {
      if (this.loginView) {
        return;
      }
      this.loadServiceProviders();
      return this.loginView = new LoginView({
        serviceProviders: SessionController.serviceProviders
      });
    };

    SessionController.prototype.triggerLogin = function(serviceProviderName) {
      var serviceProvider;
      serviceProvider = SessionController.serviceProviders[serviceProviderName];
      if (!serviceProvider.isLoaded()) {
        mediator.publish('serviceProviderMissing', serviceProviderName);
        return;
      }
      mediator.publish('loginAttempt', serviceProviderName);
      return serviceProvider.triggerLogin();
    };

    SessionController.prototype.serviceProviderSession = function(session) {
      this.serviceProviderName = session.provider.name;
      this.disposeLoginView();
      session.id = session.userId;
      delete session.userId;
      this.createUser(session);
      return this.publishLogin();
    };

    SessionController.prototype.publishLogin = function() {
      this.loginStatusDetermined = true;
      mediator.publish('login', mediator.user);
      return mediator.publish('loginStatus', true);
    };

    SessionController.prototype.triggerLogout = function() {
      return mediator.publish('logout');
    };

    SessionController.prototype.logout = function() {
      this.loginStatusDetermined = true;
      this.disposeUser();
      this.serviceProviderName = null;
      this.showLoginView();
      return mediator.publish('loginStatus', false);
    };

    SessionController.prototype.userData = function(data) {
      return mediator.user.set(data);
    };

    SessionController.prototype.disposeLoginView = function() {
      if (!this.loginView) {
        return;
      }
      this.loginView.dispose();
      return this.loginView = null;
    };

    SessionController.prototype.disposeUser = function() {
      if (!mediator.user) {
        return;
      }
      mediator.user.dispose();
      return mediator.user = null;
    };

    return SessionController;

  })(Controller);
  
}});

window.require.define({"initialize": function(exports, require, module) {
  var Application;

  Application = require('application');

  $(function() {
    var app;
    app = new Application();
    return app.initialize();
  });
  
}});

window.require.define({"lib/services/service_provider": function(exports, require, module) {
  var Chaplin, ServiceProvider, utils;

  utils = require('lib/utils');

  Chaplin = require('chaplin');

  module.exports = ServiceProvider = (function() {

    _(ServiceProvider.prototype).extend(Chaplin.Subscriber);

    ServiceProvider.prototype.loading = false;

    function ServiceProvider() {
      _(this).extend($.Deferred());
      utils.deferMethods({
        deferred: this,
        methods: ['triggerLogin', 'getLoginStatus'],
        onDeferral: this.load
      });
    }

    ServiceProvider.prototype.disposed = false;

    ServiceProvider.prototype.dispose = function() {
      if (this.disposed) {
        return;
      }
      this.unsubscribeAllEvents();
      this.disposed = true;
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    return ServiceProvider;

  })();

  /*

    Standard methods and their signatures:

    load: ->
      # Load a script like this:
      utils.loadLib 'http://example.org/foo.js', @loadHandler, @reject

    loadHandler: =>
      # Init the library, then resolve
      ServiceProviderLibrary.init(foo: 'bar')
      @resolve()

    isLoaded: ->
      # Return a Boolean
      Boolean window.ServiceProviderLibrary and ServiceProviderLibrary.login

    # Trigger login popup
    triggerLogin: (loginContext) ->
      callback = _(@loginHandler).bind(this, loginContext)
      ServiceProviderLibrary.login callback

    # Callback for the login popup
    loginHandler: (loginContext, response) =>

      eventPayload = {provider: this, loginContext}
      if response
        # Publish successful login
        mediator.publish 'loginSuccessful', eventPayload

        # Publish the session
        mediator.publish 'serviceProviderSession',
          provider: this
          userId: response.userId
          accessToken: response.accessToken
          # etc.

      else
        mediator.publish 'loginFail', eventPayload

    getLoginStatus: (callback = @loginStatusHandler, force = false) ->
      ServiceProviderLibrary.getLoginStatus callback, force

    loginStatusHandler: (response) =>
      return unless response
      mediator.publish 'serviceProviderSession',
        provider: this
        userId: response.userId
        accessToken: response.accessToken
        # etc.
  */

  
}});

window.require.define({"lib/support": function(exports, require, module) {
  var Chaplin, support, utils;

  Chaplin = require('chaplin');

  utils = require('lib/utils');

  support = utils.beget(Chaplin.support);

  module.exports = support;
  
}});

window.require.define({"lib/utils": function(exports, require, module) {
  var Chaplin, mediator, utils,
    __hasProp = {}.hasOwnProperty;

  Chaplin = require('chaplin');

  mediator = require('mediator');

  utils = Chaplin.utils.beget(Chaplin.utils);

  _(utils).extend({
    /*
      Wrap methods so they can be called before a deferred is resolved.
      The actual methods are called once the deferred is resolved.
    
      Parameters:
    
      Expects an options hash with the following properties:
    
      deferred
        The Deferred object to wait for.
    
      methods
        Either:
        - A string with a method name e.g. 'method'
        - An array of strings e.g. ['method1', 'method2']
        - An object with methods e.g. {method: -> alert('resolved!')}
    
      host (optional)
        If you pass an array of strings in the `methods` parameter the methods
        are fetched from this object. Defaults to `deferred`.
    
      target (optional)
        The target object the new wrapper methods are created at.
        Defaults to host if host is given, otherwise it defaults to deferred.
    
      onDeferral (optional)
        An additional callback function which is invoked when the method is called
        and the Deferred isn't resolved yet.
        After the method is registered as a done handler on the Deferred,
        this callback is invoked. This can be used to trigger the resolving
        of the Deferred.
    
      Examples:
    
      deferMethods(deferred: def, methods: 'foo')
        Wrap the method named foo of the given deferred def and
        postpone all calls until the deferred is resolved.
    
      deferMethods(deferred: def, methods: def.specialMethods)
        Read all methods from the hash def.specialMethods and
        create wrapped methods with the same names at def.
    
      deferMethods(
        deferred: def, methods: def.specialMethods, target: def.specialMethods
      )
        Read all methods from the object def.specialMethods and
        create wrapped methods at def.specialMethods,
        overwriting the existing ones.
    
      deferMethods(deferred: def, host: obj, methods: ['foo', 'bar'])
        Wrap the methods obj.foo and obj.bar so all calls to them are postponed
        until def is resolved. obj.foo and obj.bar are overwritten
        with their wrappers.
    */

    deferMethods: function(options) {
      var deferred, func, host, methods, methodsHash, name, onDeferral, target, _i, _len, _results;
      deferred = options.deferred;
      methods = options.methods;
      host = options.host || deferred;
      target = options.target || host;
      onDeferral = options.onDeferral;
      methodsHash = {};
      if (typeof methods === 'string') {
        methodsHash[methods] = host[methods];
      } else if (methods.length && methods[0]) {
        for (_i = 0, _len = methods.length; _i < _len; _i++) {
          name = methods[_i];
          func = host[name];
          if (typeof func !== 'function') {
            throw new TypeError("utils.deferMethods: method " + name + " notfound on host " + host);
          }
          methodsHash[name] = func;
        }
      } else {
        methodsHash = methods;
      }
      _results = [];
      for (name in methodsHash) {
        if (!__hasProp.call(methodsHash, name)) continue;
        func = methodsHash[name];
        if (typeof func !== 'function') {
          continue;
        }
        _results.push(target[name] = utils.createDeferredFunction(deferred, func, target, onDeferral));
      }
      return _results;
    },
    createDeferredFunction: function(deferred, func, context, onDeferral) {
      if (context == null) {
        context = deferred;
      }
      return function() {
        var args;
        args = arguments;
        if (deferred.state() === 'resolved') {
          return func.apply(context, args);
        } else {
          deferred.done(function() {
            return func.apply(context, args);
          });
          if (typeof onDeferral === 'function') {
            return onDeferral.apply(context);
          }
        }
      };
    }
  });

  module.exports = utils;
  
}});

window.require.define({"lib/view_helper": function(exports, require, module) {
  var mediator, utils;

  mediator = require('mediator');

  utils = require('chaplin/lib/utils');

  Handlebars.registerHelper('if_logged_in', function(options) {
    if (mediator.user) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });

  Handlebars.registerHelper('with', function(context, options) {
    if (!context || Handlebars.Utils.isEmpty(context)) {
      return options.inverse(this);
    } else {
      return options.fn(context);
    }
  });

  Handlebars.registerHelper('without', function(context, options) {
    var inverse;
    inverse = options.inverse;
    options.inverse = options.fn;
    options.fn = inverse;
    return Handlebars.helpers["with"].call(this, context, options);
  });

  Handlebars.registerHelper('with_user', function(options) {
    var context;
    context = mediator.user || {};
    return Handlebars.helpers["with"].call(this, context, options);
  });
  
}});

window.require.define({"main": function(exports, require, module) {
  var BookmarkCollection, BookmarkCollectionView, BookmarkFormView, MainRouter, TagscloudCollection, TagscloudView;

  window.app = {};

  app.routers = {};

  app.models = {};

  app.collections = {};

  app.views = {};

  MainRouter = require('routers/main_router').MainRouter;

  BookmarkCollection = require('collections/bookmark_collection').BookmarkCollection;

  TagscloudCollection = require('collections/tagscloud_collection').TagscloudCollection;

  BookmarkCollectionView = require('views/bookmark_collection_view').BookmarkCollectionView;

  TagscloudView = require('views/tagcloud_view').TagscloudView;

  BookmarkFormView = require('views/bookmark_form_view').BookmarkFormView;

  $(document).ready(function() {
    app.initialize = function() {
      app.routers.main = new MainRouter();
      app.collections.tags = new TagscloudCollection();
      app.collections.bookmarks = new BookmarkCollection();
      app.views.bookmarkCollection = new BookmarkCollectionView();
      app.views.tagscloud = new TagscloudView();
      app.views.bookmarkForm = new BookmarkFormView();
      if (Backbone.history.getFragment() === '') {
        return app.routers.main.navigate('index/page/1', true);
      }
    };
    app.initialize();
    Backbone.history.start();
    return $("#add-bookmark").click(function() {
      return app.collections.bookmarks.trigger("show-bookmark-form");
    });
  });
  
}});

window.require.define({"mediator": function(exports, require, module) {
  
  module.exports = require('chaplin').mediator;
  
}});

window.require.define({"models/base/collection": function(exports, require, module) {
  var Chaplin, Collection,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  module.exports = Collection = (function(_super) {

    __extends(Collection, _super);

    function Collection() {
      return Collection.__super__.constructor.apply(this, arguments);
    }

    return Collection;

  })(Chaplin.Collection);
  
}});

window.require.define({"models/base/model": function(exports, require, module) {
  var Chaplin, Model,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  module.exports = Model = (function(_super) {

    __extends(Model, _super);

    function Model() {
      return Model.__super__.constructor.apply(this, arguments);
    }

    return Model;

  })(Chaplin.Model);
  
}});

window.require.define({"models/bookmark_model": function(exports, require, module) {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  exports.BookmarkModel = (function(_super) {

    __extends(BookmarkModel, _super);

    function BookmarkModel() {
      return BookmarkModel.__super__.constructor.apply(this, arguments);
    }

    return BookmarkModel;

  })(Backbone.Model);
  
}});

window.require.define({"models/header": function(exports, require, module) {
  var Header, Model,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Model = require('models/base/model');

  module.exports = Header = (function(_super) {

    __extends(Header, _super);

    function Header() {
      return Header.__super__.constructor.apply(this, arguments);
    }

    Header.prototype.defaults = {
      items: [
        {
          href: 'http://brunch.readthedocs.org/',
          title: 'Documentation'
        }, {
          href: 'https://github.com/brunch/brunch/issues',
          title: 'Github Issues'
        }, {
          href: 'https://github.com/paulmillr/ostio',
          title: 'Ost.io Example App'
        }
      ]
    };

    return Header;

  })(Model);
  
}});

window.require.define({"models/tag_model": function(exports, require, module) {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  exports.TagModel = (function(_super) {
    var urlRoot;

    __extends(TagModel, _super);

    function TagModel() {
      return TagModel.__super__.constructor.apply(this, arguments);
    }

    urlRoot = '/bookmark/bookmark/';

    TagModel.prototype.defaults = {
      filter: false
    };

    TagModel.prototype.initialize = function() {
      if (!(this.filter != null)) {
        this.filter = this.defaults.filter;
      }
      return this.bind('all', function(e) {
        return console.log("TagModel", e, this);
      });
    };

    TagModel.prototype.switchFilter = function() {
      return this.set({
        "filter": !this.get("filter")
      });
    };

    return TagModel;

  })(Backbone.Model);
  
}});

window.require.define({"models/user": function(exports, require, module) {
  var Model, User,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Model = require('models/base/model');

  module.exports = User = (function(_super) {

    __extends(User, _super);

    function User() {
      return User.__super__.constructor.apply(this, arguments);
    }

    return User;

  })(Model);
  
}});

window.require.define({"routers/main_router": function(exports, require, module) {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  exports.MainRouter = (function(_super) {

    __extends(MainRouter, _super);

    function MainRouter() {
      return MainRouter.__super__.constructor.apply(this, arguments);
    }

    MainRouter.prototype.routes = {
      "about": "about",
      "index/page/:page": "bookmark"
    };

    MainRouter.prototype.about = function() {
      return console.log("about route");
    };

    MainRouter.prototype.bookmark = function(page) {
      page = Number(page);
      app.collections.bookmarks.fetch({
        data: {
          page: page
        }
      });
      app.collections.tags.fetch();
      return app.views.bookmarkForm.render();
    };

    return MainRouter;

  })(Backbone.Router);
  
}});

window.require.define({"routes": function(exports, require, module) {
  
  module.exports = function(match) {
    return match('', 'home#index');
  };
  
}});

window.require.define({"views/base/collection_view": function(exports, require, module) {
  var Chaplin, CollectionView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  View = require('views/base/view');

  module.exports = CollectionView = (function(_super) {

    __extends(CollectionView, _super);

    function CollectionView() {
      return CollectionView.__super__.constructor.apply(this, arguments);
    }

    CollectionView.prototype.getTemplateFunction = View.prototype.getTemplateFunction;

    return CollectionView;

  })(Chaplin.CollectionView);
  
}});

window.require.define({"views/base/page_view": function(exports, require, module) {
  var PageView, View, mediator,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  mediator = require('mediator');

  View = require('views/base/view');

  module.exports = PageView = (function(_super) {

    __extends(PageView, _super);

    function PageView() {
      return PageView.__super__.constructor.apply(this, arguments);
    }

    PageView.prototype.container = '#page-container';

    PageView.prototype.autoRender = true;

    PageView.prototype.renderedSubviews = false;

    PageView.prototype.initialize = function() {
      var rendered,
        _this = this;
      PageView.__super__.initialize.apply(this, arguments);
      if (this.model || this.collection) {
        rendered = false;
        return this.modelBind('change', function() {
          if (!rendered) {
            _this.render();
          }
          return rendered = true;
        });
      }
    };

    PageView.prototype.renderSubviews = function() {};

    PageView.prototype.render = function() {
      PageView.__super__.render.apply(this, arguments);
      if (!this.renderedSubviews) {
        this.renderSubviews();
        return this.renderedSubviews = true;
      }
    };

    return PageView;

  })(View);
  
}});

window.require.define({"views/base/view": function(exports, require, module) {
  var Chaplin, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  require('lib/view_helper');

  module.exports = View = (function(_super) {

    __extends(View, _super);

    function View() {
      return View.__super__.constructor.apply(this, arguments);
    }

    View.prototype.getTemplateFunction = function() {
      return this.template;
    };

    return View;

  })(Chaplin.View);
  
}});

window.require.define({"views/bookmark_collection_view": function(exports, require, module) {
  var BookmarkView, paginationTemplate,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BookmarkView = require('views/bookmark_view').BookmarkView;

  paginationTemplate = require('templates/pagination');

  exports.BookmarkCollectionView = (function(_super) {

    __extends(BookmarkCollectionView, _super);

    function BookmarkCollectionView() {
      return BookmarkCollectionView.__super__.constructor.apply(this, arguments);
    }

    BookmarkCollectionView.prototype.className = 'bookmarks';

    BookmarkCollectionView.prototype.el = $('#pagination-bookmarks');

    BookmarkCollectionView.prototype.initialize = function() {
      app.collections.bookmarks.bind('reset', this.addAll, this);
      app.collections.bookmarks.bind('all', this.render, this);
    };

    BookmarkCollectionView.prototype.addAll = function() {
      $('#bookmarks').empty();
      app.collections.bookmarks.each(this.addOne);
      this.render;
    };

    BookmarkCollectionView.prototype.addOne = function(e) {
      var view;
      view = new BookmarkView({
        model: e
      });
      $('#bookmarks').append(view.render().el);
    };

    BookmarkCollectionView.prototype.render = function() {
      var has_next, has_prev, page, ttl_page;
      ttl_page = Math.ceil(app.collections.bookmarks.total / app.collections.bookmarks.per_page);
      page = app.collections.bookmarks.page;
      has_prev = page > 1;
      has_next = page < ttl_page;
      $(this.el).html(paginationTemplate({
        ttl_page: ttl_page,
        page: page,
        has_prev: has_prev,
        has_next: has_next
      }));
      return this;
    };

    return BookmarkCollectionView;

  })(Backbone.View);
  
}});

window.require.define({"views/bookmark_form_view": function(exports, require, module) {
  var BookmarkModel,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BookmarkModel = require('models/bookmark_model').BookmarkModel;

  exports.BookmarkFormView = (function(_super) {

    __extends(BookmarkFormView, _super);

    function BookmarkFormView() {
      return BookmarkFormView.__super__.constructor.apply(this, arguments);
    }

    BookmarkFormView.prototype.tagName = 'div';

    BookmarkFormView.prototype.el = $('#bookmark-form-modal');

    BookmarkFormView.prototype.template = _.template($("#bookmark-form-modal-template").html());

    BookmarkFormView.prototype.events = {
      "submit": "submitForm"
    };

    BookmarkFormView.prototype.initialize = function() {
      this.idSelector = "#id";
      this.linkSelector = "#link";
      this.titleSelector = "#title";
      this.descriptionSelector = "#description";
      this.tagsSelector = "#tags";
      this.csrfSelector = "#csrf";
      this.csrfTokenSelector = "#bookmark-csrf";
      return app.collections.bookmarks.bind("show-bookmark-form", this.showBookmarkForm, this);
    };

    BookmarkFormView.prototype.render = function(model) {
      $(this.el).html(this.template());
      $(this.csrfSelector).val($(this.csrfTokenSelector).val());
      if (model) {
        $(this.idSelector).val(model.id);
        $(this.linkSelector).attr("disabled", "disabled");
        $(this.linkSelector).val(model.get("link"));
        $(this.titleSelector).val(model.get("title"));
        $(this.descriptionSelector).val(model.get("description"));
        $(this.tagsSelector).val(model.get("tags"));
        $("#bookmark-form-modal .update").show();
      } else {
        $("#bookmark-form-modal .create").show();
        $(this.idSelector).val("");
      }
      return this;
    };

    BookmarkFormView.prototype.submitForm = function(e) {
      var bookmark, datas, id;
      e.preventDefault();
      id = parseInt($("#id").val());
      datas = {
        link: $(this.linkSelector).val(),
        title: $(this.titleSelector).val(),
        description: $(this.descriptionSelector).val(),
        tags: $(this.tagsSelector).val(),
        csrf: $(this.csrfSelector).val()
      };
      if (_.isNumber(id)) {
        bookmark = app.collections.bookmarks.get($("#id").val());
      } else {
        bookmark = new BookmarkModel;
      }
      if (!_.isNumber(id)) {
        app.collections.bookmarks.add(bookmark);
      }
      bookmark.save(datas, {
        success: function(model, response) {
          var err, errors, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref, _ref1, _ref2, _ref3, _ref4, _results;
          $("#bookmark-csrf").val(response.csrf);
          $("#csrf").val(response.csrf);
          if (response.errors != null) {
            errors = response.errors;
            if (errors.link) {
              $("#link").parent().parent().addClass("error");
              $("#link").next().empty();
              _ref = errors.link;
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                err = _ref[_i];
                $("#link").next().append(err);
              }
            }
            if (errors.title) {
              $("#title").parent().parent().addClass("error");
              $("#title").next().empty();
              _ref1 = errors.title;
              for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                err = _ref1[_j];
                $("#title").next().append(err);
              }
            }
            if (errors.description) {
              $("#description").parent().parent().addClass("error");
              $("#description").next().empty();
              _ref2 = errors.description;
              for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
                err = _ref2[_k];
                $("#description").next().append(err);
              }
            }
            if (errors.tags) {
              $("#tags").parent().parent().addClass("error");
              $("#tags").next().empty();
              _ref3 = errors.tags;
              for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
                err = _ref3[_l];
                $("#tags").next().append(err);
              }
            }
            if (errors.csrf) {
              $("#global-errors").empty();
              _ref4 = errors.csrf;
              _results = [];
              for (_m = 0, _len4 = _ref4.length; _m < _len4; _m++) {
                err = _ref4[_m];
                _results.push($("#global-errors").append(err));
              }
              return _results;
            }
          } else {
            $("#bookmark-form-modal").modal('hide');
            window.location = "#index/page/1";
            return app.collections.bookmarks.fetch();
          }
        }
      });
    };

    BookmarkFormView.prototype.showBookmarkForm = function(model) {
      return this.render(model);
    };

    return BookmarkFormView;

  })(Backbone.View);
  
}});

window.require.define({"views/bookmark_view": function(exports, require, module) {
  var bookmarkTemplate,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  bookmarkTemplate = require('templates/bookmark');

  exports.BookmarkView = (function(_super) {

    __extends(BookmarkView, _super);

    function BookmarkView() {
      return BookmarkView.__super__.constructor.apply(this, arguments);
    }

    BookmarkView.prototype.tagName = 'div';

    BookmarkView.prototype.events = {
      "click .label": "editBookmark"
    };

    BookmarkView.prototype.render = function() {
      $(this.el).html(bookmarkTemplate({
        bookmark: this.model.toJSON()
      }));
      return this;
    };

    BookmarkView.prototype.editBookmark = function() {
      return app.collections.bookmarks.trigger("show-bookmark-form", this.model);
    };

    return BookmarkView;

  })(Backbone.View);
  
}});

window.require.define({"views/header_view": function(exports, require, module) {
  var HeaderView, View, mediator, template,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  mediator = require('mediator');

  View = require('views/base/view');

  template = require('views/templates/header');

  module.exports = HeaderView = (function(_super) {

    __extends(HeaderView, _super);

    function HeaderView() {
      return HeaderView.__super__.constructor.apply(this, arguments);
    }

    HeaderView.prototype.template = template;

    HeaderView.prototype.id = 'header';

    HeaderView.prototype.className = 'header';

    HeaderView.prototype.container = '#header-container';

    HeaderView.prototype.autoRender = true;

    HeaderView.prototype.initialize = function() {
      HeaderView.__super__.initialize.apply(this, arguments);
      this.subscribeEvent('loginStatus', this.render);
      return this.subscribeEvent('startupController', this.render);
    };

    return HeaderView;

  })(View);
  
}});

window.require.define({"views/home_page_view": function(exports, require, module) {
  var HomePageView, PageView, template,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  template = require('views/templates/home');

  PageView = require('views/base/page_view');

  module.exports = HomePageView = (function(_super) {

    __extends(HomePageView, _super);

    function HomePageView() {
      return HomePageView.__super__.constructor.apply(this, arguments);
    }

    HomePageView.prototype.template = template;

    HomePageView.prototype.className = 'home-page';

    return HomePageView;

  })(PageView);
  
}});

window.require.define({"views/layout": function(exports, require, module) {
  var Chaplin, Layout,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  module.exports = Layout = (function(_super) {

    __extends(Layout, _super);

    function Layout() {
      return Layout.__super__.constructor.apply(this, arguments);
    }

    Layout.prototype.initialize = function() {
      return Layout.__super__.initialize.apply(this, arguments);
    };

    return Layout;

  })(Chaplin.Layout);
  
}});

window.require.define({"views/login_view": function(exports, require, module) {
  var LoginView, View, mediator, template, utils,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  mediator = require('mediator');

  utils = require('lib/utils');

  View = require('views/base/view');

  template = require('views/templates/login');

  module.exports = LoginView = (function(_super) {

    __extends(LoginView, _super);

    function LoginView() {
      return LoginView.__super__.constructor.apply(this, arguments);
    }

    LoginView.prototype.template = template;

    LoginView.prototype.id = 'login';

    LoginView.prototype.container = '#content-container';

    LoginView.prototype.autoRender = true;

    LoginView.prototype.initialize = function(options) {
      LoginView.__super__.initialize.apply(this, arguments);
      return this.initButtons(options.serviceProviders);
    };

    LoginView.prototype.initButtons = function(serviceProviders) {
      var buttonSelector, failed, loaded, loginHandler, serviceProvider, serviceProviderName, _results;
      _results = [];
      for (serviceProviderName in serviceProviders) {
        serviceProvider = serviceProviders[serviceProviderName];
        buttonSelector = "." + serviceProviderName;
        this.$(buttonSelector).addClass('service-loading');
        loginHandler = _(this.loginWith).bind(this, serviceProviderName, serviceProvider);
        this.delegate('click', buttonSelector, loginHandler);
        loaded = _(this.serviceProviderLoaded).bind(this, serviceProviderName, serviceProvider);
        serviceProvider.done(loaded);
        failed = _(this.serviceProviderFailed).bind(this, serviceProviderName, serviceProvider);
        _results.push(serviceProvider.fail(failed));
      }
      return _results;
    };

    LoginView.prototype.loginWith = function(serviceProviderName, serviceProvider, e) {
      e.preventDefault();
      if (!serviceProvider.isLoaded()) {
        return;
      }
      mediator.publish('login:pickService', serviceProviderName);
      return mediator.publish('!login', serviceProviderName);
    };

    LoginView.prototype.serviceProviderLoaded = function(serviceProviderName) {
      return this.$("." + serviceProviderName).removeClass('service-loading');
    };

    LoginView.prototype.serviceProviderFailed = function(serviceProviderName) {
      return this.$("." + serviceProviderName).removeClass('service-loading').addClass('service-unavailable').attr('disabled', true).attr('title', "Error connecting. Please check whether you areblocking " + (utils.upcase(serviceProviderName)) + ".");
    };

    return LoginView;

  })(View);
  
}});

window.require.define({"views/tag_view": function(exports, require, module) {
  var tagTemplate,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  tagTemplate = require('templates/tag');

  exports.TagView = (function(_super) {

    __extends(TagView, _super);

    function TagView() {
      return TagView.__super__.constructor.apply(this, arguments);
    }

    TagView.prototype.tagName = 'span';

    TagView.prototype.className = 'tag';

    TagView.prototype.events = {
      "click": "switchFilter"
    };

    TagView.prototype.switchFilter = function() {
      this.model.switchFilter();
    };

    TagView.prototype.render = function() {
      $(this.el).html(tagTemplate({
        tag: this.model.toJSON()
      }));
      return this;
    };

    return TagView;

  })(Backbone.View);
  
}});

window.require.define({"views/tagcloud_view": function(exports, require, module) {
  var TagView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  TagView = require('views/tag_view').TagView;

  exports.TagscloudView = (function(_super) {

    __extends(TagscloudView, _super);

    function TagscloudView() {
      return TagscloudView.__super__.constructor.apply(this, arguments);
    }

    TagscloudView.prototype.className = "tagscloud";

    TagscloudView.prototype.initialize = function() {
      app.collections.tags.bind('all', this.addAll, this);
    };

    TagscloudView.prototype.addAll = function() {
      var functionFilter, tag, _i, _j, _len, _len1, _ref, _ref1;
      functionFilter = function(tag) {
        return tag.get('filter');
      };
      $("#tagscloud").empty();
      $("#tags-filter").empty();
      _ref = app.collections.tags.getUnfiltered();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tag = _ref[_i];
        this.addOneUnfiltered(tag);
      }
      _ref1 = app.collections.tags.getFiltered();
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        tag = _ref1[_j];
        this.addOneFiltered(tag);
      }
    };

    TagscloudView.prototype.addOneUnfiltered = function(tag) {
      var view;
      view = new TagView({
        model: tag
      });
      $('#tagscloud').append(view.render().el);
    };

    TagscloudView.prototype.addOneFiltered = function(tag) {
      var view;
      view = new TagView({
        model: tag
      });
      $('#tags-filter').append(view.render().el);
    };

    return TagscloudView;

  })(Backbone.View);
  
}});

