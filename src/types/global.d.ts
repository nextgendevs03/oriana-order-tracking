declare namespace JSX {
  type Element = any;
  interface IntrinsicElements {
    [elemName: string]: any;
    div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    span: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
    button: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
    input: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
    form: React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
    label: React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>;
    textarea: React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;
    select: React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;
    option: React.DetailedHTMLProps<React.OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement>;
    a: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
    img: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;
    p: React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
    h1: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
    h2: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
    h3: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
    h4: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
    h5: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
    h6: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
    ul: React.DetailedHTMLProps<React.HTMLAttributes<HTMLUListElement>, HTMLUListElement>;
    ol: React.DetailedHTMLProps<React.HTMLAttributes<HTMLOListElement>, HTMLOListElement>;
    li: React.DetailedHTMLProps<React.HTMLAttributes<HTMLLIElement>, HTMLLIElement>;
    table: React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>;
    thead: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
    tbody: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
    tr: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>;
    td: React.DetailedHTMLProps<React.TdHTMLAttributes<HTMLTableCellElement>, HTMLTableCellElement>;
    th: React.DetailedHTMLProps<React.ThHTMLAttributes<HTMLTableCellElement>, HTMLTableCellElement>;
  }
}

declare module 'react' {
  export = React;
  export as namespace React;
  
  namespace React {
    interface ReactElement<P = any, T = any> {
      type: T;
      props: P;
      key: string | number | null;
    }
    
    interface Component<P = {}, S = {}> {}
    
    type FC<P = {}> = (props: P) => ReactElement | null;
    
    function useState<S>(initialState: S | (() => S)): [S, (value: S | ((prev: S) => S)) => void];
    
    interface HTMLAttributes<T> extends DOMAttributes<T> {
      [key: string]: any;
    }
    
    interface DOMAttributes<T> {
      [key: string]: any;
    }
    
    interface DetailedHTMLProps<T, U> extends T {
      ref?: any;
    }
    
    interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
      [key: string]: any;
    }
    
    interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
      [key: string]: any;
    }
    
    interface FormHTMLAttributes<T> extends HTMLAttributes<T> {
      [key: string]: any;
    }
    
    interface LabelHTMLAttributes<T> extends HTMLAttributes<T> {
      [key: string]: any;
    }
    
    interface TextareaHTMLAttributes<T> extends HTMLAttributes<T> {
      [key: string]: any;
    }
    
    interface SelectHTMLAttributes<T> extends HTMLAttributes<T> {
      [key: string]: any;
    }
    
    interface OptionHTMLAttributes<T> extends HTMLAttributes<T> {
      [key: string]: any;
    }
    
    interface AnchorHTMLAttributes<T> extends HTMLAttributes<T> {
      [key: string]: any;
    }
    
    interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
      [key: string]: any;
    }
    
    interface TdHTMLAttributes<T> extends HTMLAttributes<T> {
      [key: string]: any;
    }
    
    interface ThHTMLAttributes<T> extends HTMLAttributes<T> {
      [key: string]: any;
    }
    
    type ReactNode = ReactElement | string | number | boolean | null | undefined;
    
    interface CSSProperties {
      [key: string]: any;
    }
  }
  
  export const StrictMode: React.FC<{ children?: React.ReactNode }>;
}

declare module 'react/jsx-runtime' {
  export function jsx(type: any, props: any, key?: any): any;
  export function jsxs(type: any, props: any, key?: any): any;
  export const Fragment: any;
}

declare module 'antd' {
  export const Card: React.FC<{
    bordered?: boolean;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    [key: string]: any;
  }>;
  
  type FormComponent = (<T = any>(props: any) => any) & {
    Item: React.FC<any>;
    useForm: <T = any>() => [any];
  };
  export const Form: FormComponent;
  
  export interface FormInstance<T = any> {
    resetFields: () => void;
    [key: string]: any;
  }
  
  export const Input: React.FC<any> & {
    TextArea: React.FC<any>;
  };
  
  export const DatePicker: React.FC<any>;
  export const Radio: React.FC<any> & {
    Group: React.FC<any>;
  };
  export const Button: React.FC<any>;
  export const Typography: React.FC<any> & {
    Title: React.FC<any>;
    Text: React.FC<any>;
  };
  export const Divider: React.FC<any>;
  export const Layout: React.FC<any> & {
    Header: React.FC<any>;
    Content: React.FC<any>;
  };
  export const Collapse: React.FC<any> & {
    Panel: React.FC<any>;
  };
  export const Tag: React.FC<any>;
  export const Row: React.FC<any>;
  export const Col: React.FC<any>;
  export const Avatar: React.FC<any>;
  export const Select: React.FC<any> & {
    Option: React.FC<any>;
  };
  export const Upload: React.FC<any>;
  export const Dropdown: React.FC<any>;
  export const Menu: React.FC<any>;
  export const message: {
    success: (content: string) => void;
    error: (content: string) => void;
    warning: (content: string) => void;
    info: (content: string) => void;
    [key: string]: any;
  };
}

