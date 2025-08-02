import { AiFillYoutube } from 'react-icons/ai'
import { AiFillInstagram } from 'react-icons/ai'
import { AiFillFacebook } from 'react-icons/ai'
import { AiOutlineMail, AiOutlinePhone, AiOutlineEnvironment } from 'react-icons/ai'

export const Footer = () => {
  return(
    <>
      <footer className="bg-[#479626]  text-white font-mhlk">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Company Info */}
            <div className="space-y-6">
              <img 
                src={`${import.meta.env.BASE_URL}photos/secondary-logo.svg`} 
                className='h-16 sm:h-20' 
                alt="Heartisans Logo" 
              />
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <AiOutlineEnvironment className="text-green-200 mt-1 flex-shrink-0" size={20} />
                  <div className="text-[#f6f6f6]">
                    <p className="text-base sm:text-lg leading-relaxed">
                      Garia, Kolkata-700152<br />
                      West Bengal, India
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <AiOutlinePhone className="text-green-200 flex-shrink-0" size={20} />
                  <p className="text-[#f6f6f6] text-base sm:text-lg">+91 8617372051</p>
                </div>
                <div className="flex items-center gap-3">
                  <AiOutlineMail className="text-green-200 flex-shrink-0" size={20} />
                  <p className="text-[#f6f6f6] text-base sm:text-lg">heartisansofficial@gmail.com</p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-xl sm:text-2xl font-bold text-white">Quick Links</h3>
              <nav className="space-y-3">
                <a href="/shop" className="block text-[#f6f6f6] hover:text-white transition-colors duration-300 text-base sm:text-lg">
                  Shop Products
                </a>
                <a href="/auction" className="block text-[#f6f6f6] hover:text-white transition-colors duration-300 text-base sm:text-lg">
                  Live Auctions
                </a>
                <a href="/sell" className="block text-[#f6f6f6] hover:text-white transition-colors duration-300 text-base sm:text-lg">
                  Sell Your Craft
                </a>
                <a href="/about" className="block text-[#f6f6f6] hover:text-white transition-colors duration-300 text-base sm:text-lg">
                  About Us
                </a>
                <a href="/ambassador" className="block text-[#f6f6f6] hover:text-white transition-colors duration-300 text-base sm:text-lg">
                  Ambassador Program
                </a>
              </nav>
            </div>

            {/* Categories */}
            <div className="space-y-6">
              <h3 className="text-xl sm:text-2xl font-bold text-white">Categories</h3>
              <nav className="space-y-3">
                <a href="/shop?category=Handicrafts" className="block text-[#f6f6f6] hover:text-white transition-colors duration-300 text-base sm:text-lg">
                  Art
                </a>
                <a href="/shop?category=Textiles" className="block text-[#f6f6f6] hover:text-white transition-colors duration-300 text-base sm:text-lg">
                  Pottery
                </a>
                <a href="/shop?category=Pottery" className="block text-[#f6f6f6] hover:text-white transition-colors duration-300 text-base sm:text-lg">
                  Crafts
                </a>
                <a href="/shop?category=Jewelry" className="block text-[#f6f6f6] hover:text-white transition-colors duration-300 text-base sm:text-lg">
                  Crochet
                </a>
                <a href="/shop?category=Paintings" className="block text-[#f6f6f6] hover:text-white transition-colors duration-300 text-base sm:text-lg">
                  Fashion
                </a>
              </nav>
            </div>

            {/* Newsletter */}
            <div className="space-y-6">
              <h3 className="text-xl sm:text-2xl font-bold text-white">Stay Connected</h3>
              <div className="space-y-4">
                <p className="text-[#f6f6f6] text-base sm:text-lg leading-relaxed">
                  Subscribe to our newsletter for the latest updates on live auctions and new artisan products.
                </p>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-[#ffffff] text-base font-bold">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="youremail@example.com"
                      className="w-full px-4 py-3 border border-[#3a7a1f] rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 bg-[#c0eaae] text-black placeholder-[#637738] text-base"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full px-6 py-3 bg-[#ff533c] hover:bg-[#ff6b57] text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-base"
                  >
                    Subscribe Now
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Social Media & Copyright */}
          <div className="border-t border-[#c0eaae] mt-12 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              
              {/* Social Media */}
              <div className="flex items-center gap-6">
                <h4 className="text-lg font-medium text-[#f6f6f6]">Follow Us:</h4>
                <div className="flex gap-4">
                  <a 
                    href="#" 
                    className="p-3 bg-[#3b7b20] hover:bg-[#60cb34] rounded-lg transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                    aria-label="Facebook"
                  >
                    <AiFillFacebook size={24} className="text-white" />
                  </a>
                  <a 
                    href="#" 
                    className="p-3 bg-[#3b7b20] hover:bg-[#60cb34] rounded-lg transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                    aria-label="Instagram"
                  >
                    <AiFillInstagram size={24} className="text-white" />
                  </a>
                  <a 
                    href="#" 
                    className="p-3 bg-[#3b7b20] hover:bg-[#60cb34] rounded-lg transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                    aria-label="YouTube"
                  >
                    <AiFillYoutube size={24} className="text-white" />
                  </a>
                </div>
              </div>

              {/* Copyright */}
              <div className="text-center md:text-right">
                <p className="text-[#f6f6f6] text-base">
                  © {new Date().getFullYear()} Heartisans. All rights reserved.
                </p>
                <p className="text-[#dff5d6] text-sm mt-1">
                  Where artisans feel seen, valued & heard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}