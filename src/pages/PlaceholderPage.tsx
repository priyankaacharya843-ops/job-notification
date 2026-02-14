import "./PlaceholderPage.css";

type Props = { title: string };

export default function PlaceholderPage({ title }: Props) {
  return (
    <div className="kn-placeholder">
      <h1 className="kn-heading kn-heading--page">{title}</h1>
      <p className="kn-subtext">This section will be built in the next step.</p>
    </div>
  );
}
