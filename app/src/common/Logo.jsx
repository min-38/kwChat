import { WithLocalSvg } from 'react-native-svg';
import LogoSvg from '../assets/images/logo.svg';

function Logo() {
    return (
        <WithLocalSvg
            width={100}
            height={100}
            fill={"#FF0000"}
            asset={require("../assets/images/logo.svg")}
        />
    )
}

export default Logo