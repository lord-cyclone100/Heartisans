import { Outlet, useNavigation } from "react-router-dom"
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { BotpressChatbot } from "../elements/BotpressChatbot";
import BackToTop from "../elements/BackToTop";

export const AppLayout = () => {
	const navigation = useNavigation();
	// console.log(navigation);
	// if(navigation.state === 'loading'){
	// 		return <Loader/>
	// }
	return(
		<>
			<div className="font-mhlk">
				<Navbar/>
				<Outlet/>
				<BackToTop/>
				<BotpressChatbot/>
				<Footer/>
			</div>
		</>
	)
}