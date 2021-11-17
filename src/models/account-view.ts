export interface IAccountView {
  label: string;

  metadata: { [key: string]: string | null };

  name: string;

  reference: string;
}
