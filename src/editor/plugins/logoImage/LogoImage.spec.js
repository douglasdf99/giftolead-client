/*import Quill from 'quill';
import LogoImage from './LogoImage';

describe('editor plugin format logo image', () => {
  const Image = {
    create: (source) => {
      const node = document.createElement('img');
      node.setAttribute('src', source);

      return node;
    },
  };

  let logoImage;

  beforeEach(() => {
    Quill.import = jest.fn(() => Image);

    logoImage = LogoImage.create('http://medias.com/icon.png');
  });

  it('returns node with signature logo attribute', () => {
    expect(logoImage.getAttribute('signature-logo')).not.toBeNull();
  });
});*/
