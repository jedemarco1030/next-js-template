// components/Footer.js

function Footer() {
  return (
    <footer className="bg-gray-800 text-white text-center p-4 mt-8">
      <div className="container mx-auto">
        <p>&copy; {new Date().getFullYear()} My Site. All rights reserved.</p>
        <p>More links or information can go here.</p>
      </div>
    </footer>
  );
}

export default Footer;
