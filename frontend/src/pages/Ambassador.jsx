import { Blob } from "../components/elements/Blob"

export const Ambassador = () => {
  return(
    <>
      <section>
        <div className="w-full bg-[#eee] flex flex-col items-center justify-between py-20 md:flex-row md:justify-evenly ">
          <svg className="size-[30rem] md:size-[34vw]" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <clipPath id="blobClip">
                <path d="M35.8,-60.9C49.6,-54,66.3,-51,75.5,-41.5C84.8,-31.9,86.6,-16,83.9,-1.6C81.2,12.9,74,25.7,65.8,37C57.6,48.3,48.3,58,37.2,64.4C26.1,70.9,13,74,1,72.3C-11.1,70.7,-22.3,64.3,-34.4,58.4C-46.4,52.5,-59.4,47.2,-64.4,37.5C-69.3,27.9,-66.1,13.9,-67.1,-0.6C-68.1,-15.1,-73.2,-30.2,-70.6,-43.7C-67.9,-57.2,-57.3,-69.1,-44.3,-76.4C-31.2,-83.7,-15.6,-86.3,-2.3,-82.3C11,-78.3,22,-67.7,35.8,-60.9Z" transform="translate(100 100)" />
              </clipPath>
            </defs>
            <image
              /*href="https://www.adazing.com/wp-content/uploads/2021/01/A-Detailed-Look-At-The-Writing-Tablet-1.jpg"*/
              href="https://res.cloudinary.com/dmljao4pk/image/upload/v1754136617/ambassador_ehtyhr.png"
              width="100%"
              height="100%"
              clipPath="url(#blobClip)"
              preserveAspectRatio="xMidYMid slice"
            />
            <path
              d="M35.8,-60.9C49.6,-54,66.3,-51,75.5,-41.5C84.8,-31.9,86.6,-16,83.9,-1.6C81.2,12.9,74,25.7,65.8,37C57.6,48.3,48.3,58,37.2,64.4C26.1,70.9,13,74,1,72.3C-11.1,70.7,-22.3,64.3,-34.4,58.4C-46.4,52.5,-59.4,47.2,-64.4,37.5C-69.3,27.9,-66.1,13.9,-67.1,-0.6C-68.1,-15.1,-73.2,-30.2,-70.6,-43.7C-67.9,-57.2,-57.3,-69.1,-44.3,-76.4C-31.2,-83.7,-15.6,-86.3,-2.3,-82.3C11,-78.3,22,-67.7,35.8,-60.9Z"
              transform="translate(100 100)"
              opacity="0.3"
            />
          </svg>
          <div className="flex flex-col items-center font-mhlk gap-10">
            <h3 className="text-[3rem] lg:text-[4rem]" style={{ color: '#479626' }}>Heartisans</h3>
            <h1 className="text-center text-[5rem] leading-20 lg:text-[6rem] lg:leading-24">Join our <br />Ambassador <br />Program</h1>
            <h5 className="text-[2rem] lg:text-[3rem]" style={{ color: '#ffaf27' }}>Coming Soon</h5>
          </div>
          
        </div>
      </section>
    </>
  )
}