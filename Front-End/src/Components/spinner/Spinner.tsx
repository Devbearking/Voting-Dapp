
import { ClipLoader } from 'react-spinners';
import classes from './Spinner.module.scss'
import { CSSProperties } from "react";


type Props = {
    isLoading?: boolean
}

const override: CSSProperties = {
    borderColor: "transparent #ffff transparent",
    borderWidth: "12px",

  };

const Spinner = ({isLoading = true}: Props) => {
  return (<>
  <div className={classes['loading-spinner']} id='loading-spinner'>
    <ClipLoader
    loading={isLoading}
    size={55}
    cssOverride={override}
    aria-label='Loading Spinner'
    data-testid='loader'
    />
  </div>
  </>);
}

export default Spinner