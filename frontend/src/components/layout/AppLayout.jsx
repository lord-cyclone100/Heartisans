import { Outlet, useNavigation } from "react-router-dom"
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { BotpressChatbot } from "../elements/BotpressChatbot";
import BackToTop from "../elements/BackToTop";

export const AppLayout = () => {
	const navigation = useNavigation();
	
	return (
		<div className="flex flex-col min-h-screen font-mhlk">
			<Navbar />
			<main className="flex-grow">
				<Outlet />
			</main>
			<BackToTop />
			<BotpressChatbot />
			<Footer />
		</div>
	);
};