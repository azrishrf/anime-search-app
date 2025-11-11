import { useState } from "react";
import { FaFacebook, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoMdClose, IoMdShare } from "react-icons/io";

interface ShareButtonProps {
  title: string;
  url: string;
}

function ShareButton({ title, url }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const shareOnTwitter = () => {
    const text = `Check out ${title}!`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank",
      "width=600,height=400"
    );
  };

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank",
      "width=600,height=400"
    );
  };

  const shareOnWhatsApp = () => {
    const text = `Check out ${title}! ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-secondary"
      >
        <IoMdShare className="text-xl" />
        Share
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute top-full left-0 mt-2 bg-dark border-2 border-dark-light rounded-2xl shadow-2xl shadow-black/40 p-4 z-50 min-w-[250px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold">Share on</h3>
              <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white">
                <IoMdClose className="text-xl" />
              </button>
            </div>
            <div className="space-y-2">
              <button
                onClick={shareOnTwitter}
                className="w-full bg-dark-light text-white px-4 py-3 rounded-xl flex items-center gap-3 font-semibold transition-all duration-200 hover:bg-[#1DA1F2]/20 hover:-translate-y-0.5 border border-dark-light hover:border-[#1DA1F2]/50"
              >
                <FaXTwitter className="text-xl" />
                Twitter
              </button>
              <button
                onClick={shareOnFacebook}
                className="w-full bg-dark-light text-white px-4 py-3 rounded-xl flex items-center gap-3 font-semibold transition-all duration-200 hover:bg-[#1877F2]/20 hover:-translate-y-0.5 border border-dark-light hover:border-[#1877F2]/50"
              >
                <FaFacebook className="text-xl" />
                Facebook
              </button>
              <button
                onClick={shareOnWhatsApp}
                className="w-full bg-dark-light text-white px-4 py-3 rounded-xl flex items-center gap-3 font-semibold transition-all duration-200 hover:bg-[#25D366]/20 hover:-translate-y-0.5 border border-dark-light hover:border-[#25D366]/50"
              >
                <FaWhatsapp className="text-xl" />
                WhatsApp
              </button>
              <button
                onClick={copyToClipboard}
                className="w-full bg-gradient-to-r from-orange to-orange-dark text-white px-4 py-3 rounded-xl font-semibold shadow-md shadow-orange/30 transition-all duration-200 hover:-translate-y-0.5"
              >
                Copy Link
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ShareButton;
