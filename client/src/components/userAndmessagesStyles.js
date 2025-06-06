import { makeStyles } from '@mui/styles';

export default makeStyles((theme) => ({
  appBar: {
    borderRadius: "15px",
    margin: "30px 0", 
    padding: "10px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center", 
  },
  heading: {
    color: 'rgba(0,183,255,1)',
  },
  image: {
    //marginLeft: "15px",
  },
  headerContent: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem', // 图片和文字之间的间距
    }
}));