import impLogo from "@/assets/brand/imp-logo-official.png";

const CONTACT_URL = "https://imanagementpro.com/en/contac-us/";

const Transition = () => {
  return (
    <main className="imp-transition relative isolate h-[100svh] overflow-hidden bg-[#fbfaf7] px-6 py-7 text-[#181818] sm:px-10 sm:py-9 lg:px-12">
      <div className="imp-transition__ambient" aria-hidden="true" />
      <div className="imp-transition__grid" aria-hidden="true" />
      <div className="imp-transition__corner imp-transition__corner--top" aria-hidden="true" />
      <div className="imp-transition__corner imp-transition__corner--bottom" aria-hidden="true" />
      <div className="imp-transition__node imp-transition__node--left" aria-hidden="true" />
      <div className="imp-transition__node imp-transition__node--right" aria-hidden="true" />

      <div className="imp-transition__logo relative z-10 overflow-hidden" aria-hidden="true">
        <img
          src={impLogo}
          alt=""
          className="imp-transition__logo-image"
        />
      </div>

      <section
        className="imp-transition__content relative z-10 mx-auto flex h-full w-full max-w-[980px] flex-col items-center justify-center text-center"
        aria-labelledby="transition-heading"
      >
        <p className="text-[0.72rem] font-bold uppercase tracking-[0.54em] text-[#a91e25] sm:text-[0.92rem]">
          THE ANALYST
        </p>

        <span className="my-6 h-px w-[72px] bg-[#b02028] sm:my-7" aria-hidden="true" />

        <h1
          id="transition-heading"
          className="text-[clamp(2.35rem,6.15vw,4.55rem)] font-bold leading-[0.98] tracking-normal text-[#151617] lg:whitespace-nowrap"
        >
          The Analyst Is Evolving.
        </h1>

        <span className="my-6 h-px w-[82px] bg-[#b02028] sm:my-7" aria-hidden="true" />

        <p className="max-w-[44rem] text-[1.04rem] leading-7 text-[#4d5259] sm:text-[1.32rem]">
          A new phase of The Analyst is currently in development.
        </p>

        <a
          href={CONTACT_URL}
          className="mt-9 inline-flex h-[60px] min-w-[186px] items-center justify-center rounded-[7px] bg-[linear-gradient(180deg,#bd202b_0%,#a91520_100%)] px-8 text-base font-bold text-white shadow-[0_18px_36px_rgba(169,30,37,0.22)] transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#8f1820] hover:shadow-[0_22px_42px_rgba(143,24,32,0.24)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a91e25]"
        >
          Contact Us
        </a>
      </section>
    </main>
  );
};

export default Transition;
