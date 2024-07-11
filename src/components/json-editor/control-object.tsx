import { withJsonFormsControlProps } from '@jsonforms/react';

type Props = {
  data: any;
  handleChange(path: string, value: any): void;
  path: string;
}

const ControlObject = ({ data, handleChange, path }: Props) => (
  <div>{data}</div>
);

export default withJsonFormsControlProps(ControlObject);
