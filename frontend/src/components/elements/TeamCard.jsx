import { FaGithub, FaLinkedin } from 'react-icons/fa';

export const TeamCard = ({ image, title, githubUrl, linkedinUrl }) => {
  return (
    <div className="group bg-[#479626] rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:scale-105 w-full max-w-md mx-auto" style={{ border: '1px solid #479626' }}>
      {/* Image Section */}
      <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden" style={{ background: 'linear-gradient(to bottom right, #479626, #3d7a20)' }}>
        <img
          src={image || "https://via.placeholder.com/400x400?text=Team+Member"}
          alt={title || "Team Member"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 absolute inset-0"
        />
        
        {/* Black Overlay with Social Icons - Only appears on hover */}
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-70 transition-all duration-300 flex items-end justify-end p-4 pointer-events-none group-hover:pointer-events-auto">
          <div className="flex space-x-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
            {githubUrl && (
              <a 
                href={githubUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors duration-200"
              >
                <FaGithub size={24} />
              </a>
            )}
            {linkedinUrl && (
              <a 
                href={linkedinUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors duration-200"
              >
                <FaLinkedin size={24} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 md:p-8 lg:p-10 text-center">
        {/* Title */}
        <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 transition-colors text-white">
          {title || "Team Member"}
        </h3>
        
      </div>
    </div>
  );
};
