import { AiFillYoutube } from 'react-icons/ai'
import { AiFillInstagram } from 'react-icons/ai'
import { AiFillFacebook } from 'react-icons/ai'

export const Footer = () => {
  return(
    <>
      <footer className="footer sm:footer-horizontal bg-green-800 text-neutral-content p-10 flex items-center justify-evenly font-mhlk">
        <aside className='flex flex-col gap-8'>
          <img src={`${import.meta.env.BASE_URL}photos/secondary-logo.svg`} className='h-20' alt="" />
          <p className='text-[1.2rem] leading-8'>
            Garia, Kolkata-700152
            <br />
            West Bengal
          </p>
        </aside>

        <form className='flex flex-col gap-12'>
            <h4 className="text-[2rem]">Subscribe to our Newsletter</h4>
            <fieldset className="w-[100%]">
              <label className='text-[1.2rem]'>Enter your email address</label>
              <div className="join w-[100%]">
                <input
                  type="text"
                  placeholder="username@site.com"
                  className="input input-bordered join-item" />
                <button className="btn btn-primary join-item">Subscribe</button>
              </div>
            </fieldset>
        </form>

        <nav>
          <h6 className="text-[2rem]">Social</h6>
          <div className="grid grid-flow-col gap-4">
            
            
            <a>
              <AiFillFacebook size={40}/>
            </a>
            <a>
              <AiFillInstagram size={40}/>
            </a>
            <a>
              <AiFillYoutube size={40}/>
            </a>
          </div>
        </nav>
      </footer>
    </>
  )
}