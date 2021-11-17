export interface ICustomerView {
  emailAddress: string;

  metadata: { [key: string]: string | null };

  name: string;
}
