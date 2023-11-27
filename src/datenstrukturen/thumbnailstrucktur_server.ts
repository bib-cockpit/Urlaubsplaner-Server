export type Thumbnailstruktur = {

  id:        string;
  fileid:    string;
  filename:  string;
  weburl:    string;
  smallurl:  string;
  mediumurl: string;
  largeurl:  string;
  size:      number;
  height: {

    small:  number;
    medium: number;
    large:  number;
};
  width: {

    small:  number;
    medium: number;
    large:  number;
  };
  Content: string;
};


// H
//
