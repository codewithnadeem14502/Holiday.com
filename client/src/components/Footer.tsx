const Footer = () => {
  return (
    <div className="bg-blue-800 py-10 ">
      <div className="container mx-auto flex justify-between items-center">
        <span className="text-white font-bold text-3xl tracking-tight">
          Holidays.com
        </span>
        <span className="text-white font-bold flex gap-4 tracking-tight">
          <p className="cursor-pointer">Terms of Service</p>
          <p className="cursor-pointer">Privacy Policy</p>
        </span>
      </div>
    </div>
  );
};
export default Footer;
