import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('login');
  this.route('procedures', function() {});
  this.route('procedure', { path: '/procedures/:procedure_id' });
});

export default Router;
