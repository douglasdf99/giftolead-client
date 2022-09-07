import Quill from 'quill';

const Image = Quill.import('formats/image');

class LogoImage extends Image {
  static create(source) {
    const node = super.create(source);
    node.setAttribute('signature-logo', '');

    return node;
  }
}

LogoImage.blotName = 'logoImage';

export default LogoImage;
