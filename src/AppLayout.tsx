const AppLayout: React.FC<any> = (props) => {
    const {
      buttons, canvas, list
    } = props;
  
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      height: '100vh'
    }}>
      <div style={{
        margin: '20px',
        width: '50%',
      }}>
        {buttons}
      </div>
      {canvas}
      <div style={{
        maxHeight: '100%',
        minHeight: '180px',
        overflow: 'auto',
      }}>
        {list}
      </div>
    </div>;
  }

  export default AppLayout;