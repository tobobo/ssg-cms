module.exports = function edit(app) {
  app.router.add('/edit/:editor', () => {
    const editorEl = document.querySelector('.js-editor');
    const editorOpts = JSON.parse(editorEl.dataset.opts);

    _.forEach(document.querySelectorAll('.js-field-list'), listContainer => {
      const listOpts = JSON.parse(listContainer.dataset.opts);
      const listEl = listContainer.querySelector('ul');
      const appendToListButton = listContainer.querySelector('.js-append-to-list');
      let list = _.get(editorOpts.editorSource, listOpts.listPath);

      function updateList() {
        list = _.map(listEl.children, listItem => {
          return _.reduce(listItem.querySelectorAll('input, textarea'), (memo, input) => {
            const inputOpts = JSON.parse(input.dataset.opts);
            _.set(memo, inputOpts.path, input.value);
            return memo;
          }, {});
        });
        _.set(editorOpts.editorSource, listOpts.listPath, list);
      }

      function addItemListener(listItemEl, itemIndex) {
        const deleteButton = listItemEl.querySelector('.js-delete-item');
        deleteButton.addEventListener('click', e => {
          e.preventDefault();
          updateList();
          list.splice(itemIndex, 1);
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
    });
  });
};
