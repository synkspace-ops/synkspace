import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveOnboardingStep } from '../../lib/onboardingProgress';

export const COUNTRY_PHONE_OPTIONS = `
Afghanistan|+93|70 123 4567
Aland Islands|+358|40 123 4567
Albania|+355|67 123 4567
Algeria|+213|551 23 45 67
American Samoa|+1-684|684 733 1234
Andorra|+376|312 345
Angola|+244|923 123 456
Anguilla|+1-264|264 235 1234
Antarctica|+672|1 2345
Antigua and Barbuda|+1-268|268 464 1234
Argentina|+54|11 2345 6789
Armenia|+374|77 123456
Aruba|+297|560 1234
Australia|+61|412 345 678
Austria|+43|664 123456
Azerbaijan|+994|50 123 45 67
Bahamas|+1-242|242 359 1234
Bahrain|+973|3600 1234
Bangladesh|+880|1712 345678
Barbados|+1-246|246 250 1234
Belarus|+375|29 123 45 67
Belgium|+32|470 12 34 56
Belize|+501|622 1234
Benin|+229|90 12 34 56
Bermuda|+1-441|441 370 1234
Bhutan|+975|17 12 34 56
Bolivia|+591|71234567
Bonaire, Sint Eustatius and Saba|+599|701 1234
Bosnia and Herzegovina|+387|61 123 456
Botswana|+267|71 123 456
Brazil|+55|11 91234 5678
British Indian Ocean Territory|+246|380 1234
British Virgin Islands|+1-284|284 300 1234
Brunei|+673|712 3456
Bulgaria|+359|87 123 4567
Burkina Faso|+226|70 12 34 56
Burundi|+257|79 12 34 56
Cambodia|+855|12 345 678
Cameroon|+237|6 71 23 45 67
Canada|+1|416 555 0123
Cape Verde|+238|991 12 34
Cayman Islands|+1-345|345 323 1234
Central African Republic|+236|70 01 23 45
Chad|+235|63 01 23 45
Chile|+56|9 6123 4567
China|+86|131 2345 6789
Christmas Island|+61|412 345 678
Cocos Islands|+61|412 345 678
Colombia|+57|321 1234567
Comoros|+269|321 23 45
Congo|+242|06 123 4567
Cook Islands|+682|71 234
Costa Rica|+506|8312 3456
Croatia|+385|91 234 5678
Cuba|+53|5 1234567
Curacao|+599|9 518 1234
Cyprus|+357|96 123456
Czech Republic|+420|601 123 456
Democratic Republic of the Congo|+243|81 234 5678
Denmark|+45|20 12 34 56
Djibouti|+253|77 83 10 01
Dominica|+1-767|767 225 1234
Dominican Republic|+1-809|809 234 5678
Ecuador|+593|99 123 4567
Egypt|+20|100 123 4567
El Salvador|+503|7012 3456
Equatorial Guinea|+240|222 123 456
Eritrea|+291|7 123 456
Estonia|+372|5123 4567
Eswatini|+268|7612 3456
Ethiopia|+251|91 123 4567
Falkland Islands|+500|51234
Faroe Islands|+298|211234
Fiji|+679|701 2345
Finland|+358|40 123 4567
France|+33|6 12 34 56 78
French Guiana|+594|694 20 12 34
French Polynesia|+689|87 12 34 56
Gabon|+241|06 03 12 34
Gambia|+220|301 2345
Georgia|+995|555 12 34 56
Germany|+49|1512 3456789
Ghana|+233|24 123 4567
Gibraltar|+350|57123456
Greece|+30|691 234 5678
Greenland|+299|22 12 34
Grenada|+1-473|473 403 1234
Guadeloupe|+590|690 30 12 34
Guam|+1-671|671 300 1234
Guatemala|+502|5123 4567
Guernsey|+44-1481|7781 123456
Guinea|+224|622 12 34 56
Guinea-Bissau|+245|955 012 345
Guyana|+592|609 1234
Haiti|+509|34 10 1234
Honduras|+504|9123 4567
Hong Kong|+852|5123 4567
Hungary|+36|20 123 4567
Iceland|+354|611 1234
India|+91|98765 43210
Indonesia|+62|812 3456 7890
Iran|+98|912 345 6789
Iraq|+964|750 123 4567
Ireland|+353|85 123 4567
Isle of Man|+44-1624|7924 123456
Israel|+972|50 123 4567
Italy|+39|312 345 6789
Ivory Coast|+225|07 12 34 56 78
Jamaica|+1-876|876 210 1234
Japan|+81|90 1234 5678
Jersey|+44-1534|7797 123456
Jordan|+962|7 9012 3456
Kazakhstan|+7|701 123 4567
Kenya|+254|712 345678
Kiribati|+686|720 12345
Kosovo|+383|43 123 456
Kuwait|+965|500 12345
Kyrgyzstan|+996|700 123 456
Laos|+856|20 23 123 456
Latvia|+371|21 234 567
Lebanon|+961|71 123 456
Lesotho|+266|5012 3456
Liberia|+231|77 012 3456
Libya|+218|91 234 5678
Liechtenstein|+423|660 123 456
Lithuania|+370|612 34567
Luxembourg|+352|621 123 456
Macau|+853|6612 3456
Madagascar|+261|32 12 345 67
Malawi|+265|991 23 45 67
Malaysia|+60|12 345 6789
Maldives|+960|771 2345
Mali|+223|65 01 23 45
Malta|+356|9912 3456
Marshall Islands|+692|235 1234
Martinique|+596|696 20 12 34
Mauritania|+222|22 12 34 56
Mauritius|+230|5251 2345
Mayotte|+262|639 12 34 56
Mexico|+52|55 1234 5678
Micronesia|+691|350 1234
Moldova|+373|69 123 456
Monaco|+377|6 12 34 56 78
Mongolia|+976|8812 3456
Montenegro|+382|67 123 456
Montserrat|+1-664|664 492 1234
Morocco|+212|650 123456
Mozambique|+258|82 123 4567
Myanmar|+95|9 123 456789
Namibia|+264|81 123 4567
Nauru|+674|555 1234
Nepal|+977|984 1234567
Netherlands|+31|6 12345678
New Caledonia|+687|75 12 34
New Zealand|+64|21 123 4567
Nicaragua|+505|8123 4567
Niger|+227|93 12 34 56
Nigeria|+234|803 123 4567
Niue|+683|1234
Norfolk Island|+672|3 12345
North Korea|+850|191 234 5678
North Macedonia|+389|70 123 456
Northern Mariana Islands|+1-670|670 234 5678
Norway|+47|406 12 345
Oman|+968|9212 3456
Pakistan|+92|300 1234567
Palau|+680|620 1234
Palestine|+970|599 123 456
Panama|+507|6123 4567
Papua New Guinea|+675|7012 3456
Paraguay|+595|981 123456
Peru|+51|912 345 678
Philippines|+63|917 123 4567
Pitcairn Islands|+64|21 123 4567
Poland|+48|512 345 678
Portugal|+351|912 345 678
Puerto Rico|+1-787|787 234 5678
Qatar|+974|3312 3456
Reunion|+262|692 12 34 56
Romania|+40|712 345 678
Russia|+7|912 345 67 89
Rwanda|+250|78 123 4567
Saint Barthelemy|+590|690 00 12 34
Saint Helena|+290|51234
Saint Kitts and Nevis|+1-869|869 765 1234
Saint Lucia|+1-758|758 284 1234
Saint Martin|+590|690 00 12 34
Saint Pierre and Miquelon|+508|55 12 34
Saint Vincent and the Grenadines|+1-784|784 430 1234
Samoa|+685|72 12345
San Marino|+378|66 66 12 12
Sao Tome and Principe|+239|981 2345
Saudi Arabia|+966|50 123 4567
Senegal|+221|77 123 45 67
Serbia|+381|60 1234567
Seychelles|+248|2 510 123
Sierra Leone|+232|76 123456
Singapore|+65|8123 4567
Sint Maarten|+1-721|721 520 1234
Slovakia|+421|912 123 456
Slovenia|+386|31 234 567
Solomon Islands|+677|74 12345
Somalia|+252|61 234 5678
South Africa|+27|82 123 4567
South Korea|+82|10 1234 5678
South Sudan|+211|91 234 5678
Spain|+34|612 34 56 78
Sri Lanka|+94|71 234 5678
Sudan|+249|91 123 4567
Suriname|+597|741 2345
Sweden|+46|70 123 45 67
Switzerland|+41|78 123 45 67
Syria|+963|944 123 456
Taiwan|+886|912 345 678
Tajikistan|+992|917 12 3456
Tanzania|+255|712 345 678
Thailand|+66|81 234 5678
Timor-Leste|+670|7721 2345
Togo|+228|90 12 34 56
Tokelau|+690|7290
Tonga|+676|771 5123
Trinidad and Tobago|+1-868|868 291 1234
Tunisia|+216|20 123 456
Turkey|+90|532 123 45 67
Turkmenistan|+993|65 123456
Turks and Caicos Islands|+1-649|649 231 1234
Tuvalu|+688|901234
Uganda|+256|712 345678
Ukraine|+380|50 123 4567
United Arab Emirates|+971|50 123 4567
United Kingdom|+44|7400 123456
United States|+1|202 555 0123
Uruguay|+598|94 231 234
US Virgin Islands|+1-340|340 642 1234
Uzbekistan|+998|90 123 45 67
Vanuatu|+678|591 2345
Vatican City|+379|06 698 12345
Venezuela|+58|412 123 4567
Vietnam|+84|91 234 56 78
Wallis and Futuna|+681|50 12 34
Western Sahara|+212|650 123456
Yemen|+967|712 345 678
Zambia|+260|95 512 3456
Zimbabwe|+263|71 234 5678
`
  .trim()
  .split('\n')
  .map((row) => {
    const [name, dialCode, placeholder] = row.split('|');
    return { name, dialCode, placeholder };
  });

const Step4_Brand_Team = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    jobTitle: '',
    workEmail: '',
    phoneCountry: 'India',
    phoneCode: '+91',
    phone: '',
    linkedin: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const selectedPhoneCountry =
    COUNTRY_PHONE_OPTIONS.find((country) => country.name === form.phoneCountry) ||
    COUNTRY_PHONE_OPTIONS.find((country) => country.name === 'India');

  const handlePhoneCountryChange = (e) => {
    const country = COUNTRY_PHONE_OPTIONS.find((item) => item.name === e.target.value);
    if (!country) return;
    setForm((prev) => ({
      ...prev,
      phoneCountry: country.name,
      phoneCode: country.dialCode,
      phone: '',
    }));
  };

  useEffect(() => {
    try {
      const existing = JSON.parse(localStorage.getItem("onboardingData") || "{}");
      localStorage.setItem(
        "onboardingData",
        JSON.stringify({
          ...(existing && typeof existing === "object" ? existing : {}),
          brand: {
            ...((existing && typeof existing === "object" && existing.brand && typeof existing.brand === "object")
              ? existing.brand
              : {}),
            step4: {
              ...((existing && typeof existing === "object" && existing.brand && typeof existing.brand === "object" && existing.brand.step4 && typeof existing.brand.step4 === "object")
                ? existing.brand.step4
                : {}),
              ...form,
            },
          },
        })
      );
    } catch (_) {}
  }, [form]);

  const handleNext = async () => {
    setLoading(true);
    setErrors({});
    try {
      await saveOnboardingStep("brand", "step4", { ...form });
      navigate('/brand/step4');
    } catch (error) {
      console.error("Error saving brand step 3:", error);
      setErrors({ submit: "Could not save this step. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] font-['Inter',sans-serif] flex flex-col items-center py-20 px-4">
      {/* Top Header */}
      <div className="flex flex-col items-center mb-14 w-full max-w-[650px]">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-24">
          <div className="flex items-center justify-center">
            <img
              src="https://fahadkasim.wordpress.com/wp-content/uploads/2026/04/chatgpt-image-apr-26-2026-02_33_31-pm.png"
              alt="SynkSpace logo"
              className="h-12 w-auto object-contain"
            />
          </div>
          <span className="text-[#050B18] text-2xl font-bold tracking-tight">
            SynkSpace
          </span>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center w-full max-w-[340px] relative mb-8">
          <div className="absolute top-1/2 left-0 w-full h-[0.5px] bg-gray-200 -translate-y-1/2 z-0"></div>
          <div className="relative z-10 flex justify-between w-full">
            <div className="w-8 h-8 bg-[#050B18] text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-900/10">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <div className="w-8 h-8 bg-[#050B18] text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-900/10">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <div className="w-8 h-8 bg-[#050B18] text-white rounded-full flex items-center justify-center font-bold text-xs shadow-lg shadow-blue-900/10">3</div>
            <div className="w-8 h-8 bg-white border border-gray-200 text-gray-300 rounded-full flex items-center justify-center font-bold text-xs">4</div>
          </div>
        </div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.25em] text-center w-full">Team & Contact</span>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-[760px] bg-white rounded-[24px] shadow-[0_4px_40px_rgb(0,0,0,0.03)] relative overflow-hidden border border-gray-50 border-t-2 border-t-[#050B18]">
        <div className="px-12 lg:px-20 py-16">
          <h1 className="text-[#050B18] text-3xl font-extrabold text-center mb-16 tracking-tight">Who is managing the brand?</h1>

          {/* Section 1: Primary Point of Contact */}
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-10 pb-4 border-b border-gray-100">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#050B18" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <h4 className="text-[#050B18] font-bold text-[15px] tracking-tight">Primary Point of Contact</h4>
            </div>

            <div className="space-y-8">
              <div className="space-y-2.5">
                <label className="text-gray-600 text-[13px] font-bold ml-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-blue-500">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </div>
                    <input
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                    type="text" 
                    placeholder="e.g. Sarah Williams" 
                    className="w-full h-12 bg-white border border-gray-100 rounded-lg pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-200 font-medium text-gray-600 shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2.5">
                  <label className="text-gray-600 text-[13px] font-bold ml-1">Job Title</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                    </div>
                    <input
                      name="jobTitle"
                      value={form.jobTitle}
                      onChange={handleChange}
                      type="text" 
                      placeholder="e.g. Marketing Manager" 
                      className="w-full h-12 bg-white border border-gray-100 rounded-lg pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-200 font-medium text-gray-600 shadow-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2.5">
                  <label className="text-gray-600 text-[13px] font-bold ml-1">Work Email</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    </div>
                    <input
                      name="workEmail"
                      value={form.workEmail}
                      onChange={handleChange}
                      type="email" 
                      placeholder="sarah@brand.com" 
                      className="w-full h-12 bg-white border border-gray-100 rounded-lg pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-200 font-medium text-gray-600 shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Contact Details */}
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-10 pb-4 border-b border-gray-100">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#050B18" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              <h4 className="text-[#050B18] font-bold text-[15px] tracking-tight">Contact Details</h4>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-8">
              <div className="space-y-2.5 min-w-0">
                <label className="text-gray-600 text-[13px] font-bold ml-1">Phone Number</label>
                <div className="grid grid-cols-[minmax(0,150px)_minmax(0,1fr)] gap-2">
                  <div className="relative min-w-0">
                    <select
                      name="phoneCountry"
                      value={form.phoneCountry}
                      onChange={handlePhoneCountryChange}
                      className="w-full min-w-0 h-12 bg-gray-50 border border-gray-100 rounded-lg pl-3 pr-8 appearance-none text-sm text-gray-500 font-bold focus:outline-none focus:border-blue-500 transition-all shadow-sm truncate"
                    >
                      {COUNTRY_PHONE_OPTIONS.map((country) => (
                        <option key={`${country.name}-${country.dialCode}`} value={country.name}>
                          {country.name} ({country.dialCode})
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                  </div>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    type="tel" 
                    placeholder={selectedPhoneCountry?.placeholder || 'Local phone number'}
                    className="w-full min-w-0 h-12 bg-white border border-gray-100 rounded-lg px-4 text-sm focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-200 font-medium text-gray-600 shadow-sm"
                  />
                </div>
                <input type="hidden" name="phoneCode" value={form.phoneCode} readOnly />
              </div>
              <div className="space-y-2.5 min-w-0">
                <div className="flex items-center gap-2 ml-1">
                  <label className="text-gray-600 text-[13px] font-bold">Official LinkedIn Profile</label>
                  <span className="text-gray-300 text-[11px] font-medium">(Optional)</span>
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  </div>
                  <input
                    name="linkedin"
                    value={form.linkedin}
                    onChange={handleChange}
                    type="text" 
                    placeholder="linkedin.com/in/username" 
                    className="w-full h-12 bg-white border border-gray-100 rounded-lg pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-200 font-medium text-gray-600 shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Collaborators */}
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-10 pb-4 border-b border-gray-100">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#050B18" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>
              <h4 className="text-[#050B18] font-bold text-[15px] tracking-tight">Collaborators</h4>
            </div>

            <div className="bg-gray-50/50 border-2 border-dashed border-gray-100 rounded-2xl p-12 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-50 flex items-center justify-center mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>
              </div>
              <h5 className="text-[#050B18] text-base font-bold mb-2 tracking-tight">Invite Team Members</h5>
              <p className="text-gray-400 text-[12px] font-medium leading-relaxed max-w-[320px] mb-8">Allow colleagues to join this brand workspace to help manage campaigns and payments.</p>
              <button className="bg-white border border-gray-200 text-[#050B18] px-8 py-3 rounded-xl text-[13px] font-bold hover:bg-gray-50 transition-all shadow-sm active:scale-[0.98]">
                + Invite Member
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-12 mt-16 pt-10 border-t border-gray-50">
            <button 
              onClick={() => navigate('/brand/step2')}
              className="text-gray-400 font-bold text-[14px] hover:text-[#050B18] transition-colors px-6"
            >
              Back
            </button>
            <button 
              onClick={handleNext}
              type="button"
              disabled={loading}
              className="flex-1 h-16 bg-[#010B1F] text-white rounded-[12px] font-bold text-[16px] flex items-center justify-center gap-3 hover:bg-[#02152a] transition-all shadow-[0_12px_24px_-8px_rgba(1,11,31,0.5)] active:scale-[0.99] border-none outline-none"
            >
              {loading ? "Saving..." : "Save & Continue"}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="flex items-center gap-3 mt-10">
        <a href="#" className="text-gray-400 text-[11px] font-medium hover:text-gray-600 transition-colors">Privacy Policy</a>
        <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
        <a href="#" className="text-gray-400 text-[11px] font-medium hover:text-gray-600 transition-colors">Terms of Service</a>
      </div>
    </div>
  );
};

export default Step4_Brand_Team;
