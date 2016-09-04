module.exports = function edit(app) {
  app.router.add('/edit/:editor', function editor() {
    const editorEl = document.querySelector('.js-editor');
    const editorOpts = JSON.parse(editorEl.dataset.opts);

    _.forEach(document.querySelectorAll('.js-field-list'), listContainer => {
      const listOpts = JSON.parse(listContainer.dataset.opts);
      const listEl = listContainer.querySelector('ul');
      const appendToListButton = listContainer.querySelector('.js-append-to-list');
      let listLength = _.get(editorOpts.editorSource, listOpts.listPath).length;

      appendToListButton.addEventListener('click', e => {
        e.preventDefault();
        const newItem = document.createElement('li');
        newItem.innerHTML = app.handlebars.partials.fields({
          fields: listOpts.field.itemFields,
          editorConfig: editorOpts.editorConfig,
          editorSource: editorOpts.editorSource,
          fieldPrefix: `${listOpts.listPath}.${listLength}.`,
        });
        listEl.appendChild(newItem);
        listLength++;
        return false;
      });
    });
  });
};
