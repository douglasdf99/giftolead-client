/*describe('editor plugin of custom signature logo', () => {
  let container;

  const mockImageHandler = { callback: jest.fn() };

  jest.mock('../handlers/image', () => jest.fn(() => mockImageHandler));

  // eslint-disable-next-line global-require
  const CustomSignatureLogo = require('./customSignatureLogo').default;

  beforeEach(() => {
    container = document.createElement('div');
    container.classList.add('ql-custom_signature_logo');

    document.body.appendChild(container);

    CustomSignatureLogo.instance({});
    container.dispatchEvent(new Event('mousedown'));
  });

  it('calls image handler callback on mouse down', () => {
    expect(mockImageHandler.callback).toBeCalled();
  });
});*/
