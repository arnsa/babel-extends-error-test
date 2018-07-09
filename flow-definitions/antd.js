declare module 'antd' {
  declare export type ColSize = {
    span?: number,
    order?: number,
    offset?: number,
    push?: number,
    pull?: number,
  }

  declare export type ColProps = {
    span?: number,
    order?: number,
    offset?: number,
    push?: number,
    pull?: number,
    xs?: number | ColSize,
    sm?: number | ColSize,
    md?: number | ColSize,
    lg?: number | ColSize,
    xl?: number | ColSize,
    xxl?: number | ColSize,
    prefixCls?: string,
  }

  declare export class Form extends React$Component<{
    layout?: string,
    onSubmit?: Function,
  }> {
    static Item: typeof FormItem,
  }

  declare export class FormItem extends React$Component<{
    prefixCls?: string,
    className?: string,
    id?: string,
    label?: React$Node,
    labelCol?: ColProps,
    wrapperCol?: ColProps,
    help?: React$Node,
    extra?: React$Node,
    validateStatus?: 'success' | 'warning' | 'error' | 'validating',
    hasFeedback?: bool,
    required?: bool,
    colon?: bool,
  }> {}

  declare export class Input extends React$Component<{
      prefixCls?: string,
      size?: 'large' | 'default' | 'small',
      onPressEnter?: SyntheticKeyboardEvent<HTMLInputElement>,
      addonBefore?: React$Node,
      addonAfter?: React$Node,
      prefix?: React$Node,
      suffix?: React$Node,
  }> {}
}
