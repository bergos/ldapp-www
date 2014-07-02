var Project = React.createClass({
  displayName: 'Project',
  getInitialState: function () {
    var
      self = this,
      project;

    project = Project.cachedJsonify.get(this.props, Project.context, function (project) {
      self.setState(project);
    });

    if (project == null) {
      project = {
        name: this.props,
        description: '',
        shortdesc: '',
      };
    }

    return project;
  },
  render: function () {
    return Project.render.main.bind(this)();
  }
});

Project.render = {
  main: function () {
    return new React.DOM.div(
      { id: this.state.name.toLowerCase(), className: 'panel panel-default' },
      Project.render.heading.bind(this)(),
      new React.DOM.div(
        { className: 'panel-body' },
        new React.DOM.div(
          { className: 'row' },
          Project.render.description.bind(this)(),
          Project.render.software.bind(this)(),
          Project.render.links.bind(this)()
        )
      )
    );
  },
  heading: function () {
    return new React.DOM.div({ className: 'panel-heading' }, new React.DOM.h3(null, this.state.name));
  },
  description: function () {
    var text = this.state.description;

    if (text == null || text === '') {
      text = this.state.shortdesc;
    }

    return new React.DOM.div({ className: 'col-md-5' }, new React.DOM.p({ className: 'text-justify' }, text));
  },
  software: function () {
    var components = [];

    components.push(new React.DOM.p(null, 'install using npm:'));
    components.push(new React.DOM.pre(null, 'npm install ' + this.state.name.toLowerCase()));

    if ('repository' in this.state && '@type' in this.state.repository) {
      if (this.state.repository['@type'] === Project.repository.typeGit) {
        components.push(new React.DOM.p(null, 'clone git repository:'));
        components.push(new React.DOM.pre(null, 'git clone ' + this.state.repository.location['@id']));
      }
    }

    return new React.DOM.div({ className: 'col-md-5' }, components);
  },
  links: function () {
    var
      components = [],
      logo = Project.render.logo.bind(this)();

    if (logo != null) {
      components.push(logo);
    }

    //TODO: fix design
    /*if ('homepage' in this.state) {
      components.push(
        new React.DOM.span({style: {'font-size': '28px', margin: '8px'}},
          new React.DOM.a(
            { href: this.state.homepage['@id']},
            new React.DOM.span({ className: 'glyphicon glyphicon-home' })
          )
        )
      );
    }*/

    if ('repository' in this.state && 'browse' in this.state.repository) {
      var clickable = 'source code';

      if ('@type' in this.state.repository && this.state.repository['@type'] === Project.repository.typeGit) {
        if (this.state.repository.browse['@id'].indexOf('https://github.com/') === 0) {
          clickable = new React.DOM.img({src: 'img/GitHub-Mark-32px.png'});
        }
      }

      components.push(new React.DOM.a({ href: this.state.repository.browse['@id']}, clickable));
    }

    return new React.DOM.div({ className: 'col-md-2 text-center' }, components);
  },
  logo: function () {
    if ('logo' in this.state) {
      return new React.DOM.img({ className: 'img-responsive', src: this.state.logo['@id'] });
    }

    return null;
  }
};

Project.cachedJsonify = new rdf.CachedJSONify();

Project.context = {
  name: 'http://usefulinc.com/ns/doap#name',
  description: 'http://usefulinc.com/ns/doap#description',
  shortdesc: 'http://usefulinc.com/ns/doap#shortdesc',
  repository: 'http://usefulinc.com/ns/doap#repository',
  location: 'http://usefulinc.com/ns/doap#location',
  browse: 'http://usefulinc.com/ns/doap#browse',
  logo: 'http://xmlns.com/foaf/0.1/logo',
  homepage: 'http://usefulinc.com/ns/doap#homepage',
};

Project.repository = {
  typeGit : 'http://usefulinc.com/ns/doap#GitRepository'
};