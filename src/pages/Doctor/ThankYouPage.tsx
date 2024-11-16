

export default function ThankYouPage() {
  return (
    <div className='pt-[35px]'>
      <div className=" h-[90vh] bg-white flex flex-col items-center justify-center px-4 py-12 rounded-[15px]">
        <div className="max-w-md w-full space-y-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 text-center">
            Thank you for applying!
          </h1>

          <div className="border-t border-b border-teal-500 py-8">
            <p className="text-lg text-gray-900 leading-relaxed text-left">
              Your Request has been sent. We shall let you know via email about your verification. Thank you for waiting.
            </p>
          </div>

          <div className="relative w-48 h-48 mx-auto">
            {/* TODO: Replace the src with your actual checkmark image */}
            <img
              src='/src/assets/doctor/requestreceivedpage.png'
              alt="Successfully requested"
              className="w-full h-full object-contain"
            />
          </div>

          <a
            href="/"
            className="inline-block w-full max-w-xs mx-auto py-3 px-4 text-lg bg-teal-500 hover:bg-teal-600 text-white rounded-md transition-colors text-center"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  )
}