import Logo from "../assets/general/face-recognition.png";

const LogoHeader = () => {
    return (
        <div className="flex items-center space-x-3">
            <a href="/" className="flex items-center space-x-2 hover:opacity-90 transition">
                <img src={Logo} alt="Logo" className="h-8 w-8 object-contain" />
                <span className="text-xl md:text-2xl font-extrabold text-gray-800 tracking-wide">
                    FACE <span className="text-blue-600">CLASS</span>
                </span>
            </a>
        </div>
    );
}

export default LogoHeader