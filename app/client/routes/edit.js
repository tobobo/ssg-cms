module.exports = function edit(app) {
  app.router.add('/edit', _.noop);

  app.router.add('/edit/:editor', () => {
    const Dropzone = require('dropzone');

    const editorEl = document.querySelector('.js-editor');
    const editorOpts = JSON.parse(editorEl.dataset.opts);

    _.forEach(document.querySelectorAll('.js-image-field'), imageField => {
      const fieldOpts = JSON.parse(imageField.dataset.opts);
      const dropzoneEl = imageField.querySelector('.js-image-upload');
      const imagePathEl = imageField.querySelector('.js-image-path');
      const hiddenImageInput = imageField.querySelector('.js-hidden-image-input');
      const itemDropzone = new Dropzone(dropzoneEl, {
        url: '/edit/files',
        uploadMultiple: false,
        addRemoveLinks: false,
        init() {
          this.on('addedfile', file => {
            if (this.files[1]) {
              this.removeFile(this.files[0]);
            }
            imagePathEl.value = file.name;
          });
        },
        accept(file, done) {
          itemDropzone.options.paramName = `${fieldOpts.field.basePath}/${imagePathEl.value}`;
          done();
        },
        success(err, response) {
          debugger;
          hiddenImageInput.value = `/${response.filename}`;
          return null;
        },
      });
    });

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

      function addItemListener(listItemEl, itemIndex) {
        const deleteButton = listItemEl.querySelector('.js-delete-item');
        deleteButton.addEventListener('click', e => {
          e.preventDefault();
          updateListData();
          list.splice(itemIndex, 1);
          renderList();
        });
      }

      function addItemListeners() {
        _.forEach(listEl.children, addItemListener);
      }

      addItemListeners();

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
