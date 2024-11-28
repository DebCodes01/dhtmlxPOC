export default function Toolbar({ zoom, setZoom }) {
  const zoomRadios = ['Days', 'Weeks', 'Months', 'Quarter','Year'].map((value) => {
    const isActive = zoom === value;
    return (
      <label key={ value } className={ `radio-label ${isActive ? 'radio-label-active': ''}` }>
        <input type='radio'
          checked={ isActive }
          onChange={(e) => setZoom(e.target.value)}
          value={ value }/>
        { value }
      </label>
    );
  });

  return (
    <div className="tool-bar">
      <b>Zoom: </b>
        { zoomRadios }
    </div>
  );
}