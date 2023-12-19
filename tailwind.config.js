module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      gradientColorStops: (theme) => ({
        primary: "#B13FCF",
        Secprimary: "#986DE929",
        secondary: "#53B1DF",
        Secsecondary: "#E79B6C29",
        danger: "#FFD700",
      }),
      backgroundColor: (theme) => ({
        LightPurple: "#AC45CF5C",
        ModalBg: "#0d0d309e",
        Modal: "#0d0d2e",
      }),
      backgroundImage: {
        progress: "linear-gradient(to right, #6996db, #a849d0)",
      },
      padding: {
        btnx: "1.875rem",
        btny: "0.688rem",
        ptcard: "0.938rem",
        footer: "5rem",
        footersm: "2.5rem",
        bfooter: "1.75rem",
      },
      margin: {
        mbcard: "7.5rem",
        mtcard: "-6.875rem",
      },
      borderRadius: {
        borderContainer: "1.75rem",
        borderRadiusCard: "1.125rem",
      },
      maxWidth: {
        "1/5": "950px",
      },
      maxHeight: {
        "1/5": "700",
      },
      boxShadow: {
        cst: "0px 0px 5px 1px grey",
        cstgr: "0px 0px 22px 1px green",
      },
      screens: {
        xsm: "420px",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
