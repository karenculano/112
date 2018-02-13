export default settings => {
  const { prefix } = settings;
  return {
    selectorInit: '[data-file]',
    selectorInput: `input[type="file"].${prefix}--file-input`,
    selectorContainer: '[data-file-container]',
    selectorCloseButton: `.${prefix}--file-close`,
    classLoading: `${prefix}--loading`,
    classLoadingSvg: `${prefix}--loading__svg`,
    classFileName: `${prefix}--file-filename`,
    classFileClose: `${prefix}--file-close`,
    classFileComplete: `${prefix}--file-complete`,
    classSelectedFile: `${prefix}--file__selected-file`,
    classStateContainer: `${prefix}--file__state-container`,
    eventBeforeDeleteFilenameFileuploader: 'fileuploader-before-delete-filename',
    eventAfterDeleteFilenameFileuploader: 'fileuploader-after-delete-filename',
  };
};
