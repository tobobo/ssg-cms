module.exports = function edit(app) {
  app.router.add('/edit', _.noop);

  app.router.add('/edit/:editor', () => {
    const Dropzone = require('dropzone');

    const editorEl = document.querySelector('.js-editor');
    const editorOpts = JSON.parse(editorEl.dataset.opts);

    function setupFileFields(parentEl = document) {
      _.forEach(parentEl.querySelectorAll('.js-file-field'), fileField => {
        const fieldOpts = JSON.parse(fileField.dataset.opts);
        const dropzoneEl = fileField.querySelector('.js-file-upload');
        const hiddenfileInput = fileField.querySelector('.js-hidden-file-input');
        let fileName;
        const itemDropzone = new Dropzone(dropzoneEl, {
          url: '/edit/files',
          uploadMultiple: false,
          addRemoveLinks: false,
          previewTemplate: app.handlebars.partials.filepreview(),
          init() {
            this.on('addedfile', file => {
              if (this.files[1]) {
                this.removeFile(this.files[0]);
              }
              fileName = file.name;
            });
          },
          accept(file, done) {
            itemDropzone.options.headers = {
              'x-file-base-path': fieldOpts.field.basePath,
              'x-file-path': fileName,
            };
            done();
          },
          success(err, response) {
            const pathPrefix = fieldOpts.field.configPrefix ?
            `/${fieldOpts.field.configPrefix}` : '/';
            hiddenfileInput.value = `${pathPrefix}/${response.filePath}`;
          },
        });
      });
    }

    setupFileFields();

    _.forEach(document.querySelectorAll('.js-field-list'), listContainer => {
      const listOpts = JSON.parse(listContainer.dataset.opts);
      const listEl = listContainer.querySelector('ul');
      const appendToListButton = listContainer.querySelector('.js-append-to-list');
      const prependToListButton = listContainer.querySelector('.js-prepend-to-list');
      let list = _.get(editorOpts.editorSource, listOpts.listPath);

      function updateListData() {
        list = _.map(listEl.children, listItem =>
          _.reduce(listItem.querySelectorAll('input, textarea'), (memo, input) => {
            const inputOpts = JSON.parse(input.dataset.opts);
            _.set(memo, inputOpts.path, input.value);
            return memo;
          }, {})
        );
        _.set(editorOpts.editorSource, listOpts.listPath, list);
      }

      function renderList() {
        const newList = document.createElement('ul');
        _.forEach(list, (listItem, itemElIndex) => {
          const newItem = document.createElement('li');
          newItem.innerHTML = app.handlebars.partials.listitem({
            listItem,
            itemIndex: itemElIndex,
            fields: listOpts.field.itemFields,
            editorConfig: editorOpts.editorConfig,
            editorSource: editorOpts.editorSource,
            fieldPrefix: `${listOpts.listPath}.${itemElIndex}.`,
          });
          newList.appendChild(newItem);
        });
        listEl.innerHTML = newList.innerHTML;
        addItemListeners();
      }

      function addItemListener(listItemEl, itemIndex, opts) {
        opts = _.defaults(opts, {initFiles: true});
        const deleteButton = listItemEl.querySelector('.js-delete-item');
        if (opts.initFiles) setupFileFields(listItemEl);
        deleteButton.addEventListener('click', e => {
          e.preventDefault();
          updateListData();
          list.splice(itemIndex, 1);
          renderList();
        });
      }

      function addItemListeners(options) {
        _.forEach(listEl.children, (listItemEl, itemIndex) =>
          addItemListener(listItemEl, itemIndex, options)
        );
      }

      addItemListeners({initFiles: false});

      appendToListButton.addEventListener('click', e => {
        e.preventDefault();
        const newItem = document.createElement('li');
        newItem.innerHTML = app.handlebars.partials.listitem({
          itemIndex: list.length,
          fields: listOpts.field.itemFields,
          editorConfig: editorOpts.editorConfig,
          editorSource: editorOpts.editorSource,
          fieldPrefix: `${listOpts.listPath}.${list.length}.`,
        });
        addItemListener(newItem, list.length);
        list.push({});
        listEl.appendChild(newItem);
        return false;
      });

      prependToListButton.addEventListener('click', e => {
        e.preventDefault();
        updateListData();
        list.unshift({});
        renderList();
        return false;
      });
    });
  });
};
