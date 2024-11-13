

export default function HeroHome() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero content */}
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="pb-12 text-center md:pb-20">
            <h1
              className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text pb-5 font-nacelle text-4xl font-semibold text-transparent md:text-5xl"
              data-aos="fade-up"
            >
             Squid Integration
            </h1>
            <div className="mx-auto max-w-3xl">
              <p
                className="mb-8 text-xl text-indigo-200/65"
                data-aos="fade-up"
                data-aos-delay={200}
              >
                Give it a whirl 
              </p>
              <div className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center">
                <div data-aos="fade-up" data-aos-delay={400}>
                 <iframe
    title="squid_widget"
    width="490"
    height="684"
    src=" https://studio.squidrouter.com/iframe?config=%7B%22integratorId%22%3A%22squid-swap-widget-v2%22%2C%22theme%22%3A%7B%22borderRadius%22%3A%7B%22button-lg-primary%22%3A%223.75rem%22%2C%22button-lg-secondary%22%3A%223.75rem%22%2C%22button-lg-tertiary%22%3A%223.75rem%22%2C%22button-md-primary%22%3A%221.25rem%22%2C%22button-md-secondary%22%3A%221.25rem%22%2C%22button-md-tertiary%22%3A%221.25rem%22%2C%22container%22%3A%221.875rem%22%2C%22input%22%3A%229999px%22%2C%22menu-sm%22%3A%220.9375rem%22%2C%22menu-lg%22%3A%221.25rem%22%2C%22modal%22%3A%221.875rem%22%7D%2C%22fontSize%22%3A%7B%22caption%22%3A%220.875rem%22%2C%22body-small%22%3A%221.14375rem%22%2C%22body-medium%22%3A%221.40625rem%22%2C%22body-large%22%3A%221.75625rem%22%2C%22heading-small%22%3A%222.1875rem%22%2C%22heading-medium%22%3A%223.08125rem%22%2C%22heading-large%22%3A%224.40625rem%22%7D%2C%22fontWeight%22%3A%7B%22caption%22%3A%22400%22%2C%22body-small%22%3A%22400%22%2C%22body-medium%22%3A%22400%22%2C%22body-large%22%3A%22400%22%2C%22heading-small%22%3A%22400%22%2C%22heading-medium%22%3A%22400%22%2C%22heading-large%22%3A%22400%22%7D%2C%22fontFamily%22%3A%7B%22squid-main%22%3A%22Geist%2C%20sans-serif%22%7D%2C%22boxShadow%22%3A%7B%22container%22%3A%220px%202px%204px%200px%20rgba(0%2C%200%2C%200%2C%200.20)%2C%200px%205px%2050px%20-1px%20rgba(0%2C%200%2C%200%2C%200.33)%22%7D%2C%22color%22%3A%7B%22grey-100%22%3A%22%23FBFBFD%22%2C%22grey-200%22%3A%22%23EDEFF3%22%2C%22grey-300%22%3A%22%23D1D6E0%22%2C%22grey-400%22%3A%22%23A7ABBE%22%2C%22grey-500%22%3A%22%238A8FA8%22%2C%22grey-600%22%3A%22%23676B7E%22%2C%22grey-700%22%3A%22%234C515D%22%2C%22grey-800%22%3A%22%23292C32%22%2C%22grey-900%22%3A%22%2317191C%22%2C%22royal-300%22%3A%22%23D9BEF4%22%2C%22royal-400%22%3A%22%23B893EC%22%2C%22royal-500%22%3A%22%23565658%22%2C%22royal-600%22%3A%22%238353C5%22%2C%22royal-700%22%3A%22%236B45A1%22%2C%22status-positive%22%3A%22%237AE870%22%2C%22status-negative%22%3A%22%23FF4D5B%22%2C%22status-partial%22%3A%22%23F3AF25%22%2C%22highlight-700%22%3A%22%23E4FE53%22%2C%22animation-bg%22%3A%22%23565658%22%2C%22animation-text%22%3A%22%23FBFBFD%22%2C%22button-lg-primary-bg%22%3A%22%23565658%22%2C%22button-lg-primary-text%22%3A%22%23FBFBFD%22%2C%22button-lg-secondary-bg%22%3A%22%23FBFBFD%22%2C%22button-lg-secondary-text%22%3A%22%23292C32%22%2C%22button-lg-tertiary-bg%22%3A%22%23292C32%22%2C%22button-lg-tertiary-text%22%3A%22%23D1D6E0%22%2C%22button-md-primary-bg%22%3A%22%23565658%22%2C%22button-md-primary-text%22%3A%22%23FBFBFD%22%2C%22button-md-secondary-bg%22%3A%22%23FBFBFD%22%2C%22button-md-secondary-text%22%3A%22%23292C32%22%2C%22button-md-tertiary-bg%22%3A%22%23292C32%22%2C%22button-md-tertiary-text%22%3A%22%23D1D6E0%22%2C%22input-bg%22%3A%22%2317191C%22%2C%22input-placeholder%22%3A%22%23676B7E%22%2C%22input-text%22%3A%22%23D1D6E0%22%2C%22input-selection%22%3A%22%23D1D6E0%22%2C%22menu-bg%22%3A%22%2317191CA8%22%2C%22menu-text%22%3A%22%23FBFBFDA8%22%2C%22menu-backdrop%22%3A%22%23FBFBFD1A%22%2C%22modal-backdrop%22%3A%22%2317191C54%22%7D%7D%2C%22themeType%22%3A%22dark%22%2C%22apiUrl%22%3A%22https%3A%2F%2Fapiplus.squidrouter.com%22%2C%22priceImpactWarnings%22%3A%7B%22warning%22%3A3%2C%22critical%22%3A5%7D%2C%22initialAssets%22%3A%7B%22from%22%3A%7B%22address%22%3A%220xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE%22%2C%22chainId%22%3A%221%22%7D%7D%7D"
/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
