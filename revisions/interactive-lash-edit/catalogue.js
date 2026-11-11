const mjCatalogue = {
  bookingBase: 'https://mjlashparlour.as.me/?appointmentType=',
  looks: {
    moonlight: { id: 38488323, name: 'Moonlight', style: 'Soft light volume', price: '£55', duration: '2h', image: 'macro-moonlight.webp', map: 'D curl · 13, 15, 17, 19 mm', description: 'Light volume with a graduated length range.', note: 'A light-volume set with a softer finish. MJ’s listing says lengths can be adjusted.' },
    wispy: { id: 38487366, name: 'Wispy Diva', style: 'Textured volume', price: '£65–£70', duration: '2h', image: 'macro-wispy.webp', map: 'D curl · 13–21 mm', description: 'MJ lists 17, 20 and 25 mm spikes over the base.', note: 'Acuity lists £70 and describes a £65 option without bottom lashes. Confirm your choice with MJ before paying.' },
    kat: { id: 38487716, name: 'Kat I', style: 'Sharp cat-eye volume', price: '£60', duration: '2h', image: 'macro-kat.webp', map: 'D curl · 11–20 mm', description: 'Listed lengths build towards the outer corner.', note: 'A dramatic cat eye that builds from a short inner corner towards the outer edge.' },
    tokyo: { id: 76030524, name: 'Tokyo Dreams', style: 'Spiked cat eye', price: '£70', duration: '2h 30m', image: 'macro-tokyo.webp', map: 'C and D curl · 10–20 mm', description: 'Five spikes are listed. Exact spike lengths can vary.', note: 'A dramatic cat-eye set with five spikes. The listed appointment includes bottom lashes.' },
    luna: { id: 81023688, name: 'Dark Luna 2.0', style: 'Russian volume', price: '£60', duration: '2h 20m', note: 'The listed set excludes a flick and bottom lashes.' },
  },
  categories: {
    sets: {
      items: [
        { id: 38488323, name: 'Moonlight', price: '£55', duration: '2h', look: 'moonlight' },
        { id: 38524372, name: 'Hybrids', price: '£55', duration: '2h', note: 'A light mix of classic and volume lashes.' },
        { id: 81023688, name: 'Dark Luna 2.0 · Russian volume', price: '£60', duration: '2h 20m', look: 'luna' },
        { id: 40346296, name: 'Mega Mummy · Full volume', price: '£70', duration: '2h', note: 'A full set. Check the appointment listing for suitability and preparation.' },
      ],
    },
    infills: {
      note: 'Some two- and three-week prices differ from the amount displayed in Acuity. Confirm the price for your set and interval with MJ before paying.',
      items: [{ id: 'category:LASH INFILLS', name: 'See infills by set', direct: true }],
    },
    brows: {
      items: [
        { id: 42589916, name: 'Brow tint', price: '£10', duration: '20m' },
        { id: 42589820, name: 'Brow wax', price: '£12', duration: '15m' },
        { id: 42589702, name: 'Brow tint and wax', price: '£15', duration: '30m' },
      ],
    },
    facials: {
      items: [
        { id: 42587495, name: 'Facial consultation', price: '£5', duration: '15m' },
        { id: 42588253, name: 'Basic facial', price: '£30', duration: '45m' },
        { id: 42587993, name: 'Neat Clean facial', price: '£35', duration: '45m' },
        { id: 42588834, name: 'Different Luxe facial', price: '£45', duration: '1h 10m' },
      ],
    },
    wax: {
      items: [
        { id: 44431154, name: 'Upper lip wax', price: '£6', duration: '10m' },
        { id: 44432027, name: 'Underarm wax', price: '£15', duration: '30m' },
        { id: 44431473, name: 'Half leg wax', price: '£20', duration: '20m' },
        { id: 'category:BODY WAX', name: 'More body and bikini waxing options', direct: true },
        { id: 'category:Vajacial (vagina facials)', name: 'Specialist intimate-care appointments', direct: true },
      ],
    },
  },
};
