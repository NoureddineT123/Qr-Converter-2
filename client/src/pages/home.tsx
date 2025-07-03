import { QrCode, Zap, Shield, Smartphone } from "lucide-react";
import UrlToQr from "@/components/url-to-qr";
import QrToUrl from "@/components/qr-to-url";
import RecentActivity from "@/components/recent-activity";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <QrCode className="h-8 w-8 text-brand-600 mr-3" />
                <h1 className="text-xl font-bold text-gray-900">QR Converter</h1>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Convert URLs to QR Codes & Back
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Generate QR codes from URLs instantly or decode QR codes back to their original links. 
            Fast, secure, and completely free.
          </p>
        </div>

        {/* Main Converter Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <UrlToQr />
          <QrToUrl />
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Why Choose Our QR Converter?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h4>
              <p className="text-gray-600">Generate and decode QR codes instantly without any delays or page reloads.</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Secure & Private</h4>
              <p className="text-gray-600">All processing happens locally in your browser. Your data never leaves your device.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Mobile Friendly</h4>
              <p className="text-gray-600">Works perfectly on all devices - desktop, tablet, and mobile phones.</p>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <RecentActivity />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600 mb-2">© 2025 QR Converter. All rights reserved.</p>
            <p className="text-sm text-gray-500">
              Built with ❤️ for the web. No data is stored or transmitted.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
