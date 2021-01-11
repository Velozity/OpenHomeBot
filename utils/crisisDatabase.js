const Chariot = require('chariot.js');
const Promise = require('bluebird');
const _ = require('lodash');

/** Get DM channel id and send MSG to user */
module.exports = function crisisData(country) {
  const countries = [
    'algeria,dz',
    'argentina,ar',
    'armenia,am',
    'australia,au',
    'austria,at',
    'azerbaijan,az',
    'the bahamas,bs',
    'bangladesh,bd',
    'barbados,bb',
    'belarus,by',
    'belgium,be',
    'bosnia and herzegovina,ba',
    'bolivia,bo',
    'botswana,bw',
    'brazil,br',
    'brunei,bn',
    'bulgaria,bg',
    'canada,ca',
    'china,cn',
    'colombia,co',
    'croatia,hr',
    'cuba,cu',
    'cyprus,cy',
    'czech republic,cz',
    'denmark,dk',
    'egypt,eg',
    'estonia,ee',
    'fiji,fj',
    'finland,fl',
    'france,fr',
    'germany,de',
    'ghana,gh',
    'greece,gr',
    'greenland,gl',
    'guyana,gy',
    'hong kong,hk',
    'hungary,hu',
    'iceland,is',
    'india,in',
    'indonesia,id',
    'iran,ir',
    'ireland,ie',
    'israel,il',
    'italy,it',
    'japan,jp',
    'jordan,jo',
    'korea,kr',
    'kosovo,xk',
    'latvia,lv',
    'lebanon,lb',
    'liberia,lr',
    'lithuania,lt',
    'luxembourg,lu',
    'malaysia,my',
    'malta,mt',
    'mauritius,mu',
    'mexico,mx',
    'morocco,ma',
    'netherlands,nl',
    'new zealand,nz',
    'norway,no',
    'the philippines,ph',
    'poland,pl',
    'portugal,pt',
    'romania,ro',
    'russia,ru',
    'serbia,rs',
    'singapore,sg',
    'slovakia,sk',
    'slovenia,sl',
    'south africa,za',
    'spain,es',
    'sri lanka,lk',
    'saint vincent and the grenadines,vc',
    'sudan,sd',
    'sweden,se',
    'switzerland,ch',
    'taiwan,tw',
    'thailand,th',
    'tonga,to',
    'trinidad and tobago,tt',
    'turkey,tr',
    'united kingdom,uk',
    'united states,us'
  ]

  const result = countries.find((c) => c.split(',').includes(country.toLowerCase()));

  switch(result) {
    case 'algeria,dz': return { 
      country: result, 
      text: `**34342** and **43** are the national emergency numbers for police and ambulances in Algeria.

Suicide Hotline Algeria: **0021 3983 2000 58**` 
    };
    case 'argentina,ar': return { 
      country: result, 
      text: `**911** is the national emergency number in Argentina.

Centro de Asistencia al Suicida by calling **135** (Greater Buenos Aires) or **5275-1135** (rest of the country).

SOS Un Amigo Anonimo is available seven days a week from 10 AM to 7 PM by calling **4783–8888**` 
    };
    case 'armenia,am': return { 
      country: result, 
      text: `**112** and **911** are the national emergency numbers in Armenia.

Trust Social Work and Sociological Research Centre: can be reached at **(2) 538194** or **(2) 538197**` 
    };
    case 'australia,au': return { 
      country: result, 
      text: `**000** is the national emergency number in Australia.

Lifeline is a 24-hour nationwide service that provides access to crisis support, suicide prevention and mental health support services. It can be reached at **13 11 14**. They also offer an online chat service from 7pm to midnight Sydney time every day.

Kids Helpline is a 24-hour nationwide service that provides access to crisis support, suicide prevention and counselling services for Australians aged 5–25. It can be reached at **1800 55 1800**. In addition the Kids Helpline does also provide online chat services.

Beyond Blue provides nationwide information and support regarding anxiety, depression, and suicide. It has a helpline which can be reached by calling **1300 22 4636**. The helpline is available 24 hours a day, 7 days a week. In addition, the organisation also provides online chat from 3 pm to 12 am every day.

The Suicide Call Back Service is a nationwide service that provides professional 24/7 telephone and online counselling to people who are affected by suicide. It has a helpline which can be reached by calling **1300 659 467**. The organisation also offers online chat and video chat services.

MensLine Australia is a 24/7 telephone and online counselling service for men with emotional health, mental health and relationship concerns. It has a helpline which can be reached by calling **1300 78 99 78**. The organisation also online counselling.` 
    };
    case 'austria,at': return { 
      country: result, 
      text: `**112** is the national emergency number in Austria.

**142** is the number of Telefonseelsorge in Austria. Free of charge, operating 24 hours a day.

**147** is the number of Rat auf Draht, a crisis number especially for children, juveniles and their attachment figures. Free of charge, operating 24 hours a day.` 
    };
    case 'azerbaijan,az': return { 
      country: result, 
      text: `**112** is the national emergency number in Azerbaijan.

      **510-66-36** is the official youth crisis hotline operated by Initiative for Development.` 
    };
    case 'the bahamas,bs': return { 
      country: result, 
      text: `**911** is the national emergency number in The Bahamas.

National Suicide Hotline: **322-2763**` 
    };
    case 'bangladesh,bd': return { 
      country: result, 
      text: `**999** is the national emergency number in Bangladesh. 199 is the national number for ambulance and fire.

Kaan Pete Roi (http://shuni.org/) is an emotional support helpline in Bangladesh whose mission is to alleviate feelings of despair, isolation, distress, and suicidal feelings among members of the community, through confidential listening. The helpline is intended for suicide prevention and the promotion of mental health.` 
    };
    case 'barbados,bb': return { 
      country: result, 
      text: `**911** is the national emergency number in Barbados.

Samaritans of Barbados: **(246) 4299999**` 
    };
    case 'belarus,by': return { 
      country: result, 
      text: `**112** works on the territory of Belarus (works for tourists as well). Call 102 for police and 103 for ambulance if needed.

For victims of violence at home: **8 801 100 8 801** (anonymous, 24/7).
For children: **801-100-1611** (anonymous, 24/7).

Other psychological help phones can be reached at (http://minzdrav.gov.by)` 
    };
    case 'belgium,be': return { 
      country: result, 
      text: `**112** is the national emergency number in Belgium.

Stichting Zelfmoordlijn 1813 provides a 24/7 national suicide prevention phone line and a webchat everyday from 18:30 to 22:00 for Dutch language.

Zelfmoordlijn 1813 limited webchat can be found at https://www.zelfmoord1813.be/chat-met-zelfmoordlijn-1813.

Stichting Centre de Prévention du Suicide provides a 24/7 national suicide prevention phone line for French language.

The Center for the Prevention of Suicide website and Forum can be found at https://www.preventionsuicide.be/fr/j-ai-besoin-d-aide.html` 
    };
    case 'bosnia and herzegovina,ba': return { 
      country: result, 
      text: `**122** is the national police number in Bosnia and Herzegovina.

**123** is the national fire-brigade number in Bosnia and Herzegovina.

**124** is the national emergency number in Bosnia and Herzegovina.

Centar Srce is a Serbian organisation for emotional support. Currently there isn't any other organisation inside Bosnia and Herzegovina that deals with suicidal thought and prevention.

**0800-300303** is the number of Centar Srce.` 
    };
    case 'bolivia,bo': return { 
      country: result, 
      text: `**911** is the national emergency number in Bolivia.

Teléfono de la Esperanza aims at promoting mental health to the Spanish and Portuguese-speaking world. Bolivians living in Cochabamba and La Paz can call **(00 591 4) 4 25 42 42** and **75288084**.` 
    };
    case 'botswana,bw': return { 
      country: result, 
      text: `**911** is the national emergency number in Botswana.

**3911270** is the national lifeline.` 
    };
    case 'brazil,br': return { 
      country: result, 
      text: `**188** is a national emergency number in Brazil.

**190** and **192** are the national emergency numbers for police and ambulances in Brazil.

Centro de Valorização da Vida (http://www.cvv.org.br/) is an emotional and suicidal prevention support NGO founded in 1962 in São Paulo, Brazil, and recognized as Federal Public Utility in 1973. It offers voluntary and free support, with all communications being confidential. Contacts can be made through the phone number 141 (available 24/7), personally (in one of the 72 centres around the country), chat (via their website), VoIP (via Skype) and e-mail.` 
    };
    case 'brunei,bn': return { 
      country: result, 
      text: `**991** is the emergency number for ambulances

**993** is the emergency number for police

**145** is the national suicide hotline` 
    };
    case 'bulgaria,bg': return { 
      country: result, 
      text: `**112** is the national emergency number in Bulgaria.

**0035 9249 17 223** is the number for the Sofia Hotline.` 
    };
    case 'canada,ca': return { 
      country: result, 
      text: `**911** is the national emergency number in Canada.

Kids Help Phone (https://kidshelpphone.ca/) is a free 24/7 national support service that provides confidential professional counselling, information, referrals and volunteer-led, text-based support to young people in both English and French.

Crisis Services Canada (http://www.crisisservicescanada.ca/) nationwide suicide prevention and support network.

Crisis Text Line powered by Kids Help Phone (crisistextline.ca) is a free, confidential 24/7 national crisis-intervention text-message service.
Crisis Text Line can be reached by texting CONNECT (English) or PARLER (French) to **686-868**.

Trans Lifeline (http://www.translifeline.org/) is a toll-free crisis hotline available in the United States and in Canada for transgender people staffed by transgender people.
**The Trans Lifeline can be reached at **1-877-330-6366**.

The Canadian Association for Suicide Prevention (https://suicideprevention.ca) maintains a Canada-wide list of phone numbers and websites related to suicide prevention.` 
    };
    case 'china,cn': return { 
      country: result, 
      text: `**110** is the national emergency number in mainland China.

Beijing Suicide Research and Prevention Center (http://www.crisis.org.cn), a World Health Organization Collaborating Centre for Research and Training in Suicide Prevention, available 24/7 at **800-810-1117** (for landline callers) or **010-8295-1332** (for mobile and VoIP callers)

Lifeline China (https://www.lifelinechina.org/) available 10am to 10pm every day at **400 821 1215**.
Shanghai Mental Health Center (http://www.smhc.org.cn) serves as a mental health clinic as well as teaching, researching and planning mental health prevention throughout China. They can be reached at **021–64387250**.
Shenzhen Mental Health Center (http://www.psyonline.com.cn/) free professional counseling available 24/7 at **0755-25629459**

Guangzhou Crisis Research and Intervention Center (http://www.gzcrisis.com/) available 24/7 at 020-81899120 or **020-12320-5**, online counseling is also available with QQ messenger at **1661042151**

Mental Health Center of School of Medicine of Zhejiang University (http://www.hz7hospital.com/) available 24/7 at **0571-85029595**` 
    };
    case 'colombia,co': return { 
      country: result, 
      text: `**123** is the national emergency number in Colombia.

**106** provides support for issues such as depression, alcoholism, drug abuse, and suicide that traditional centers might not accomplish.` 
    };
    case 'croatia,hr': return { 
      country: result, 
      text: `**112** is the national emergency number in Croatia.

Plavi Telefon (www.plavi-telefon.hr) can be called at **48 33 888** and aim to provide support for issues such as depression, alcoholism, drug abuse and suicide that traditional centers might not accomplish.` 
    };
    case 'cuba,cu': return { 
      country: result, 
      text: `**104** Ambulance

**105** Fire

**106** Police` 
    };
    case 'cyprus,cy': return { 
      country: result, 
      text: `**112** and **199** are the national emergency numbers in Cyprus.

Cyprus Samaritans (http://www.cyprussamaritans.org) is available every day from 4pm to 12am and is confidential. They can be reached at **8000 7773**.` 
    };
    case 'czech republic,cz': return { 
      country: result, 
      text: `**112** is the national emergency number in the Czech Republic.

**116 111** for kids and students under 26 years old. (https://www.linkabezpeci.cz/)` 
    };
    case 'denmark,dk': return { 
      country: result, 
      text: `Livslinien (https://www.livslinien.dk) offers telephone support 11am-4am on **70 201 201**, or online chat

**112** is the national emergency number in Denmark.` 
    };
    case 'egypt,eg': return { 
      country: result, 
      text: `**122** is the national emergency number for police in Egypt.

**123** is the national emergency number for emergency health services in Egypt

**126** is the foreigners emergency number in Egypt.

https://befrienderscairo.com/, BeFrienders in Cairo, Egypt, along with their two hotlines: **762 1602/3** and **762 2381**.` 
    };
    case 'estonia,ee': return { 
      country: result, 
      text: `**112** is the national emergency number in Estonia.

Eluliin (http://www.eluliin.ee/) provides emotional support for those suffering from depression and relationship issues. They're available from 7pm to 7am at **655 8088**` 
    };
    case 'fiji,fj': return { 
      country: result, 
      text: `**917** is the national emergency number in Fiji.

Lifeline Fiji runs the National Crisis Line, Crisis Support, and Suicide Intervention line. Free calls at any time on **132454**` 
    };
    case 'finland,fl': return { 
      country: result, 
      text: `**112** is the national emergency number in Finland.

Finnish Association for Mental Health has provided assistance and support for those dealing with mental health issues and suicide since 1897. They can be reached at **010 195 202** (Finnish) or **(09) 4135 0501** (foreigners).` 
    };
    case 'france,fr': return { 
      country: result, 
      text: `**112** is the national emergency number in France, **15** is the number for ambulances, **114** for all emergency services for deaf using FAX or SMS and 17 is for police.

Fil santé jeunes : **0800 235 236** : anonymous and toll-free number for young people.

Suicide écoute : **01 45 39 40 00** (24-hour) : suicide prevention helpline (volunteers).

SOS Suicide Phénix: **01 40 44 46 45** (schedule) : suicide prevention through listening and hospitality (volunteers).

Sos amitié : distress listening on multimedia platform : phone, email, chat (volunteers).

La Croix Rouge Ecoute : **0 800 858 858** : psychological support online, anonymous and free (volunteers).` 
    };
    case 'germany,de': return { 
      country: result, 
      text: `**112** is the national emergency number in Germany.

Telefonseelsorge (http://www.telefonseelsorge.de/) (24/7, no cost): **0800 111 0 111** (Protestant), **0800 111 0 222** (Catholic), **0800 111 0 333** (for children and youth)` 
    };
    case 'ghana,gh': return { 
      country: result, 
      text: `**999** is the national emergency number in Ghana.

National Lifeline: **2332 444 71279**` 
    };
    case 'greece,gr': return { 
      country: result, 
      text: `Suicide hotline: **1018** (http://suicide-help.gr)

National emergency number: **112** (https://112.gr/en-us/)

Police: **100** (http://www.astynomia.gr)

Fire: **199** (https://www.fireservice.gr)

Ambulance: **166** (https://www.ekab.gr/)

SOS Lifeline for the elderly: **1065** (http://www.lifelinehellas.gr/)

Cyber Crime Division: **11188** (https://cyberalert.gr/)

National Helpline for Children: **1056** (https://www.hamogelo.gr/gr/en/sos-1056/)

General Secretariat for Family Policy and Gender Equality: **15900** (http://www.isotita.gr/en/home/)

Open support line for the LGBT community: **11528** (https://help.unhcr.org/greece/el/where-to-seek-help/emergency-services/)` 
    };
    case 'greenland,gl': return { 
      country: result, 
      text: `**134** is the national crisis number for Greenland` 
    };
    case 'guyana,gy': return { 
      country: result, 
      text: `**999** is the national emergency number in Guyana.

Inter-agency Suicide Prevention Help Line (http://guyanapoliceforce.gy/police/policing-menu/community-outreach-programs/launching-of-inter-agency-suicide-prevention-help-line) was launched by the Guyana Police Force in 2015 to help those struggling with depression. They can be reached 24 hours a day by calling **223–0001**, **223–0009**, or **223–0818**, as well as **600-7896** or **623-4444** by cellphone.` 
    };
    case 'hong kong,hk': return { 
      country: result, 
      text: `**999** is the national emergency number in Hong Kong.

The Samaritans Hong Kong (https://samaritans.org.hk) is available 24/7 by calling **2896 0000**.

The Samaritan Befrienders Hong Kong is available 24/7 at **23892222**.` 
    };
    case 'hungary,hu': return { 
      country: result, 
      text: `**112** is the national emergency number for Hungary. **104** is the national number for ambulances and **107** is for police

Blue line (http://www.sos116-123.hu/index.php/segelykeres) - **116-123** is a nationwide 24-hour hotline - **sos@sos116-123.hu** is an email address to use. Helpline providing emotional support for those who are stressed, distressed, depressed, or suicidal.

Help line: (http://www.kek-vonal.hu/index.php/hu/lelkisegely-vonal) - **116-111** is a helpline providing emotional support for those who are stressed, distressed, depressed, or suicidal.` 
    };
    case 'iceland,is': return { 
      country: result, 
      text: `**112** is the emergency number
**1717** Hjálparsími Rauða Krossins (Suicide help line)` 
    };
    case 'india,in': return { 
      country: result, 
      text: `**112** is the national emergency number for India.

Samaritans Mumbai: (samaritansmumbai.com) - **+91 8422984528**, **+91 8422984529**, **+91 8422984530** - 3 pm to 9 pm, all days. samaritans.helpline@gmail.com. Helpline providing emotional support for those who are stressed, distressed, depressed, or suicidal.

AASRA (http://www.aasra.info/): **91-22-27546669** is a 24-hours a day, 7 days a week nationwide voluntary, professional and confidential services.

Sneha India (http://www.snehaindia.org) is available 24/7 on the phone by calling **91 44 24640050**.

Befrienders India (http://befriendersindia.net/helpline-details.php) contains contact numbers of local crisis helplines in 15+ cities in India.` 
    };
    case 'indonesia,id': return { 
      country: result, 
      text: `**112** is the national emergency number for Indonesia.

Kementerian Kesehatan: **150-0454**` 
    };
    case 'iran,ir': return { 
      country: result, 
      text: `**110** and **115** are the national emergency numbers for police and ambulances in Iran.

The Iran National Organization of Well-Being, has provided various methods by which the individuals can use the specialists' services free of charge for a variety of problems such as marriage, family, the youth and children, suicide, etc. including online, in person and by phone.
Online: By registering at Moshaver.behzisti.ir
In person: ‌‌By finding the closest location in The Iran National Organization of Well-Being website.
By phone: Calling **1480**. This hotline is open from 6 am until 9 pm everyday and its services are reached from all provinces of Iran.` 
    };
    case 'ireland,ie': return { 
      country: result, 
      text: `**112** and **999** are the national emergency numbers in Ireland.

Samaritans (http://www.samaritans.org/) is a registered charity aimed at providing emotional support to anyone in distress or at risk of suicide throughout Ireland.
Freephone **116 123** for Samaritans anywhere in Ireland or Northern Ireland.` 
    };
    case 'israel,il': return { 
      country: result, 
      text: `**100** and **101** are the national emergency numbers for police and ambulances in Israel.
Eran.org.il Suicide line (https://web.archive.org/web/20110909164614/http://eran.org.il/) operates 24/7 including holidays and can be reached from all regions of Israel by calling 1201 or 972-9 8891333 from abroad. SMS service is given as well during Sunday - Friday between 14:00-18:00 at **076-88444-00**.` 
    };
    case 'italy,it': return { 
      country: result, 
      text: `**112** is the national emergency number for Italy.

Servizio per la Prevenzione del Suicidio (SPS) (http://www.prevenireilsuicidio.it/) ) is a suicide prevention helpline whose mission is to give psychological and emotional support to anyone in suicidal crisis or to anyone who lost a dear one for suicide, through a confidential listening from an equipe of doctors, psychologists and volunteers. The helpline is operating from 9.30 am till 4.30 pm, from Monday to Friday, and it can be reached from all regions of Italy.

Samaritans - ONLUS (http://www.samaritansonlus.org) is available every day from 1pm to 10pm by calling **800 86 00 22** or **06 77208977**.

Telefono Amico (http://www.telefonoamico.it) provides services everyday from 10am to 12am by calling **199284284**.` 
    };
    case 'japan,jp': return { 
      country: result, 
      text: `**110** and **119** are the national emergency numbers for police and ambulances in Japan.

TELL (http://telljp.com/lifeline/) provides a free, confidential English-language Lifeline service, plus clinical mental health services, for the international community in Japan.

Befrienders Worldwide Osaka Suicide Prevent Center (http://www.spc-osaka.org)` 
    };
    case 'jordan,jo': return { 
      country: result, 
      text: `**911** is the national emergency number in Jordan.

**110** for Families & Children (https://www.jordanriver.jo/en/programs/protecting-children/110-families-children) The Helpline offers services in psychological support and consultation, as well as referrals. The initiative aims to alleviate the effect of risk factors children in vulnerable families are exposed to, including families facing challenges impairing their parenting, as well as abuse cases.` 
    };
    case 'korea,kr': return { 
      country: result, 
      text: `**112** and **119** are the national emergency numbers for police and ambulances in South Korea.

Suicide.org (suicide.org) has a list of South Korean suicide hotlines.` 
    };
    case 'kosovo,xk': return { 
      country: result, 
      text: `**080012345** is the number of suicide prevention hotline in Kosovo.` 
    };
    case 'latvia,lv': return { 
      country: result, 
      text: `**113** is the national emergency number in Latvia.

Skalbes.lv (http://www.skalbes.lv/) You can call them on **+371 67222922** or **+371 27722292** the lines are working 24h on all week days.` 
    };
    case 'lebanon,lb': return { 
      country: result, 
      text: `Suicide Hotline Lebanon (Embrace): **1564**

Embrace LifeLine (http://www.embracelifeline.org/) You can call them on **1564** the lines are working from 12 P.M until 2 A.M on all week days.` 
    };
    case 'liberia,lr': return { 
      country: result, 
      text: `**911** is the national emergency number in Liberia

Lifeline Liberia: **6534308**` 
    };
    case 'lithuania,lt': return { 
      country: result, 
      text: `Vilties Linija:  Free and anonymous prevention of suicide and psychological crises for adults by phone. Phone **116 123**, 24/7

Vaikų liniją (Childline):  Free and anonymous help to the children and teenagers by phone and online. Phone **116 111** 11:00 AM to 11:00 PM or chat online here (Mon-Fri, 6PM-9PM)

J aunimo linija (Youth Line):  Free, confidential and anonymous emotional support line for those struggling with daily issues, emotional distress or at risk of suicide. Help is being provided by Phone **8 800 28888** (24/7), email or chat online here (Mon-Sat, 6 PM - 10 PM)` 
    };
    case 'luxembourg,lu': return { 
      country: result, 
      text: `**112** is the national emergency number in Luxembourg.

454545.lu (https://454545.lu/) **+352 45 45 45** the lines are working 11h-23h on all week days and 11h-3h on Friday and Saturday.` 
    };
    case 'malaysia,my': return { 
      country: result, 
      text: `**999** is the national emergency number in Malaysia.

Befrienders (http://www.befrienders.org.my) offers a 24/7, confidential hotline.

Befrienders hotline can be reached at **03-79568144** or **03-79568145**.` 
    };
    case 'malta,mt': return { 
      country: result, 
      text: `**112** is the national emergency number in Malta

Appogg Supportline **179**` 
    };
    case 'mauritius,mu': return { 
      country: result, 
      text: `**112** and **114** are the national emergency numbers for police and ambulances in Mauritius.

Befrienders Mauritius (http://www.befrienders.org/directory?country=MU) offer a limited-hour crisis helpline for English and French speakers. Befrienders Maritius hotline can be reached at **+230 800 93 93** (available from 09:00 to 21:00 daily).
Mauritius Suicide Prevention Lifeline is an emotional support helpline in Mauritius whose mission is to alleviate feelings of despair, isolation, distress, and suicidal feelings among members of the community, through confidential listening. The helpline is intended for suicide prevention and the promotion of mental health.` 
    };
    case 'mexico,mx': return { 
      country: result, 
      text: `**911** is the national emergency number in Mexico.

SAPTEL (http://www.saptel.org.mx/index.html) is an independent care provider subsidized by the Mexican red cross. It can be reached at (55) 5259-8121. SAPTEL has been active since 2000. It is totally free and they are available 24 hours a day, 365 days a year. Provides crisis dialogue or treatment for anything related to mental health crisis.` 
    };
    case 'morocco,ma': return { 
      country: result, 
      text: `Sourire de Reda (Befrienders Casablanca) website: https://www.sourire2reda.org
Their hotlines: **+212 (5) 22 87 47 40** Landline, (from 09:00 to 17:00, Mon. - Fri.) **+212 (6) 62 58 95 70** Mobile, (from 09:00 to 17:00, Mon. - Fri.) Languages spoken: French, Arabic` 
    };
    case 'netherlands,nl': return { 
      country: result, 
      text: `**112** is the national emergency number in the Netherlands.

Stichting 113Online (https://www.113.nl/) provides a 24/7 national suicide prevention phone line and webchat.

113Online hotline can be reached at **113** or **0800 0113**.

113Online Webchat can be found at https://www.113.nl/ik-denk-aan-zelfmoord/crisislijn.` 
    };
    case 'new zealand,nz': return { 
      country: result, 
      text: `**111** is the national emergency number in New Zealand.

**1737**, need to talk? (http://www.1737.org.nz) is the national mental health and addictions helpline. Free call or text **1737** any time for support from a trained counsellor.

Lifeline Aotearoa (http://www.lifeline.org.nz) is a New Zealand organisation providing free 24-hour counseling and phone help lines. It provides support, information and resources to people at risk of suicide, family and friends affected by suicide and people supporting someone with suicidal thoughts and/or suicidal behaviours. Call **09 5222 999** if you live within Auckland or **0800 543 354** for those outside of Auckland.

Youthline (https://www.youthline.co.nz) Call **0800 376 633** or text **234**.

The Lowdown (https://thelowdown.co.nz) provides assistance in dealing with issues such as relationships, anxiety, and depression and are available by e-mail or texting **5626**.` 
    };
    case 'norway,no': return { 
      country: result, 
      text: `**112** and **113** is the national emergency numbers for police and ambulances in Norway

Mental Helse Mental Helse (Mental Health). Can be reached at **116 123** and is open 24 hours a day, 7 days a week. Mental Helse does also provide an online mail service at http://sidetmedord.no where users can write messages anonymously and get answers within 48-hours. A chat-service is also provided. It is open Mondays from 19.00 - 22.00 and Wednesdays: from 19.00 - 22.00. The chat-services may not always be open in July and on public celebration days or Sundays.

Kirkens SOS Kirkens SOS(The Church SOS). Can be reached at **22 40 00 40** and is open 24 hours a day, 7 days a week. The line is free to call and confidential. Kirkens SOS does also provide an anonymous message service(which replies within 24-hours) 27 hours a day, 7 days a week and a chat open 7 days a week at 18.30 - 22.30.` 
    };
    case 'the philippines,ph': return { 
      country: result, 
      text: `**911** is the national emergency number in the Philippines.

National Center for Mental Health 24/7 Crisis Hotline: **(02) 7989-USAP (8727)** or **0917 899 USAP (8727)**

The Natasha Goulbourn Foundation (http://www.ngf-hope.org/contact-us/) provides 24/7 assistance to those who call **(02) 8804-HOPE (4673)** or **0917 558 HOPE (4673)**

Manila Lifeline Centre: **(02) 8896-9191**

In Touch Community Services 24/7 Crisis Hotline: **(02) 8893 7603**, **0917 800 1123** or **0922 893 8944**` 
    };
    case 'poland,pl': return { 
      country: result, 
      text: `**112** is the national emergency number in Poland.

Olsztynski Telefon Zaufania 'Anonimowy Przyjaciel (http://telefonzaufania.org/) provides 24/7 assistance as it is the only unit of this type in Poland. They can be reached by calling **89 19288** or **89 527 00 00**.` 
    };
    case 'portugal,pt': return { 
      country: result, 
      text: `**112** is the national emergency number in Portugal.

Voz de Apoio (http://www.vozdeapoio.pt) is anonymous and confidential. You can speak to them by calling **225 50 60 70** or through Skype, face-to-face, or writing.

Sos Voz Amiga (http://www.sosvozamiga.org) is available daily from 4pm to 12am by calling **213 544 545**, **912 802 669**, or **963 524 660**. Free Green Line callers can call **800 209 899** from 9pm to 12am.

Sos Estudante (http://sosestudante.pt) provides anonymous, confidential support every day from 8pm to 1am by calling **915 246 060**, **969 554 545**, **239 484 020** as well as through Skype.` 
    };
    case 'romania,ro': return { 
      country: result, 
      text: `**112** is the national emergency number in Romania.

Alianţa Română de Prevenţie a Suicidului (http://www.antisuicid.com/) is a Romanian support helpline whose mission is to give psychological and emotional support to those that find themselves in depression, those who are in a psychological crisis and those who are suicidal. Help is offered by psychologists and volunteers from Psychology Universities.

TelVerde antidepresie: **0800 0800 20**. A toll-free anti-depression hotline which is available 24/7.` 
    };
    case 'russia,ru': return { 
      country: result, 
      text: `**112** is the national emergency number in Russia.

**051 (or 8495051)** is a 24-hour emergency number for Moscow residents

Samaritans (Cherepovets): **007 (8202) 577-577**` 
    };
    case 'serbia,rs': return { 
      country: result, 
      text: `**192** is the national police emergency number for Serbia

**193** is the national emergency medical services number for Serbia

SRCE Novi Sad (http://www.centarsrce.org/): **(+381) 21-6623-393**` 
    };
    case 'singapore,sg': return { 
      country: result, 
      text: `**999** and **995** are the national emergency numbers for the police and ambulances in Singapore.


The Samaritans of Singapore (https://sos.org.sg/) is the only 24-hour, toll-free, confidential suicide prevention hotline in Singapore, for anyone having difficulty coping during a crisis, who are thinking of suicide or affected by suicide.

The Institute of Mental Health (Singapore) also has a 24-hour Mental Health Helpline (https://www.imh.com.sg/contact-us/) if you are facing a mental health crisis or emergency.

The Singapore Association of Mental Health (http://www.samhealth.org.sg/) is a voluntary welfare organisation that provides a toll-free counselling helpline for those with emotional crisis or mental health conditions.` 
    };
    case 'slovakia,sk': return { 
      country: result, 
      text: `**112** is the national emergency number in Slovakia

**051 / 7731 000** - Linka dôvery (Prešov) (Mo: 7.00 - 15.30, Tue - Thu: 7.00 - 15.00, Fri: 7.00 - 14.30)

IPčko.sk (www.ipcko.sk) - Suicide prevention and psychological help (mainly for youth), providing online chat counseling service from 7am to midnight. IPčko also provides email counseling 24/7 on ipcko@ipcko.sk.` 
    };
    case 'slovenia,sl': return { 
      country: result, 
      text: `**112** is the national emergency number in Slovenia.

Zaupni telefon Samarijan in Sopotnik (http://www.telefon-samarijan.si/) is available 24-hours a day, 7-days a week. The purpose of the organisation is to be available for a conversation to anyone suffering from distress. The confidential phone call hotline is carried out in accordance with the fundamental principles of the international organisation IFOTES. Qualified volunteers can be reached on the toll-free telephone number **116 123**.

TOM – telefon za otroke in mladostnike (http://www.e-tom.si) is available 7-days a week from 13:00 - 20:00 and is primarily meant for children and adolescents in distress. The telephone functions within the Association of Friends of Youth of Slovenia (ZPMS). It serves the purpose of providing emotional support for children and young people who face various questions, dilemmas or distress during the process of growing up. Advisers are available to callers needing to share their problems or are seeking advice and additional information on the toll-free telephone number **116 111**.

Klic v duševni stiski (http://www.psih-klinika.si/koristne-informacije/klic-v-dusevni-stiski/) is available 7-days a week 19:00 - 7:00. Counsellors of the hotline are trained to work with people and especially trained to talk with people who are having suicidal thoughts. However, you can call for help regardless of the cause of your distress. They are available on the telephone number **(01) 520-99-00**.

Ženska svetovalnica – krizni center (http://www.drustvo-zenska-svetovalnica.si/o-nas) is available 24-hours a day, 7-days a week. It is a voluntary women's organisation that works in the field of psycho-social assistance and the self-help of women who are victims of violence. They offer free counseling, information on public service competencies and assistance in organizing self-help groups to women in need. They are available on the telephone number **+386 31 233 211**.` 
    };
    case 'south africa,za': return { 
      country: result, 
      text: `**10111** and **10177** are the national emergency numbers for the police and ambulances in South Africa.

The Triangle project (https://triangle.org.za/about/) provides a helpline where lesbian, gay, bisexual, transgender and intersex people can talk to a trained professional. The professional will ensure the callers privacy and can also refer the caller to other support networks. It can be reached at **(021) 712 6699** daily from 13:00 to 21:00. The counselor will then call you back.

Suicide Crisis Line: Call **0800 567 567** or SMS **31393**` 
    };
    case 'spain,es': return { 
      country: result, 
      text: `**112** is the national emergency number in Spain.

Teléfono de la Esperanza (http://www.telefonodelaesperanza.org) is open 24 hours a day, 7 days a week, allowing callers to discuss a range of challenges from trauma and suicide to relationship issues.They can be reached by calling **717 003 717**` 
    };
    case 'sri lanka,lk': return { 
      country: result, 
      text: `Sri Lanka Sumithrayo - Bandarawela: **011 057 2222662**` 
    };
    case 'saint vincent and the grenadines,vc': return { 
      country: result, 
      text: `The Samaritans, St. Vincent: **(784) 456 1044**` 
    };
    case 'sudan,sd': return { 
      country: result, 
      text: `Befrienders Khartoum: **(249) 11-555-253**` 
    };
    case 'sweden,se': return { 
      country: result, 
      text: `**112** is the national emergency number in Sweden.

Självmordslinjen (Suicide prevention hotline) (https://mind.se/sjalvmordslinjen/) is a registered Non-profit organisation that has worked with mental health since 1931. The organisation provides a 24-hour email, chat and hotline service, all of which are toll-free.

Hjälplinjen (The help line) (https://www.1177.se/Stockholm/Om-1177/Om-Hjalplinjen/) offers temporary psychological support over the phone (toll-free), 7 days a week 13:00 - 22:00. You can opt to be anonymous. The service is run by Sweden's municipalities through Vårdguiden (the care guide).

BRIS - Barnens rätt i samhället (Children's right in society) (https://www.bris.se/) is a children's right organisation. they offer toll-free and anonymous support for all children and young adults up to the age of 18 through phone and chat every day of the year 14:00 - 21:00. BRIS can be reached at **116 111** but also offers contact to curators through email and contact with other youth through their online forum.` 
    };
    case 'switzerland,ch': return { 
      country: result, 
      text: `**112** is the national emergency number in Switzerland.

Die dargebotene Hand (https://www.143.ch/): **143** (helpline for any kind of life crisis and mental health problems)` 
    };
    case 'taiwan,tw': return { 
      country: result, 
      text: `**119** is the national emergency number of the ROC (Taiwan)

MOHW Suicide Prevention Line: **1925** (https://www.mohw.gov.tw/cp-16-48244-1.html)

Lifeline: **1995** (http://www.life1995.org.tw/)` 
    };
    case 'thailand,th': return { 
      country: result, 
      text: `Samaritans of Thailand: **(02) 713-6793**` 
    };
    case 'tonga,to': return { 
      country: result, 
      text: `Lifeline: **23000**` 
    };
    case 'trinidad and tobago,tt': return { 
      country: result, 
      text: `Lifeline: **(868) 645 2800**` 
    };
    case 'turkey,tr': return { 
      country: result, 
      text: `National Medical Emergency Line: **112**` 
    };
    case 'united kingdom,uk': return { 
      country: result, 
      text: `**999** and **112** is the national emergency number in the United Kingdom

**111**, Option 2, is the National Health Services' First Response Service for mental health crises and support. This is not available in all areas of the country yet.

Samaritans (http://www.samaritans.org/) is a registered charity aimed at providing emotional support to anyone in distress or at risk of suicide throughout the United Kingdom. They provide a 24/7, toll-free crisis line, as well as local branches.
Samaritans Helpline can be reached at **116 123**.
Samaritans' previous hotline number, **08457 90 90 90**, is no longer in use. Calling this line may result in charges for call forwarding.

Campaign Against Living Miserably (https://www.thecalmzone.net/) is a registered charity based in England. It was launched in March 2006 as a campaign aimed at bringing the suicide rate down among men aged 15–35. It has a limited-hour phone and webchat options.

CALM (Nationwide) can be reached at **0800 58 58 58** (available every day from 5PM to midnight).
CALM (London) can be reached at **0808 802 58 58** (available every day from 5PM to midnight).
CALM webchat can be found at https://www.thecalmzone.net/help/get-help/ (available every day from 5PM to midnight).

Shout (https://www.giveusashout.org/) is the UK's first free 24/7 text service for anyone in crisis anytime, anywhere. It is a place to go for those struggling to cope and in need of immediate help. Shout is an affiliate of the 'Crisis Text Line' in the U.S., but this is the first time the tried and tested technology has come to the UK.
Text HELP to **85258**` 
    };
    case 'united states,us': return { 
      country: result, 
      text: `**911** is the national emergency number in the United States.

The National Suicide Prevention Lifeline (http://suicidepreventionlifeline.org/) is a 24-hour, toll-free, confidential suicide prevention hotline available to anyone in suicidal crisis or emotional distress. It provides Spanish-speaking counselors, as well as options for deaf and hard of hearing individuals. It is only available in the United States. A 24-hour an Online Chat in partnership with Contact USA is also available.
The National Suicide Prevention Lifeline can be reached at **1-800-273-8255**, and in 2019, the use of 988 was approved.
The National Suicide Prevention Lifeline (ESP) can be reached at **1-888-628-9454**
The National Suicide Prevention Lifeline (Deaf & Hard of Hearing Options) can be reached at **1-800-799-4889**

The Veterans Crisis Line (https://www.veteranscrisisline.net/) is a 24-hour, toll-free hotline that provides phone, webchat, and text options available to military veterans and their families. It provides options for deaf and hard of hearing individuals.
The Veterans Crisis Line can be reached at **1-800-273-8255**, followed by Pressing 1.

IMAlive Crisis Chatine (www.imalive.org) is a non-profit, worldwide 24/7, anonymous chatline to help anyone in crisis via instant messaging.

The Crisis Text Line (crisistextline.org) is the only 24/7, nationwide crisis-intervention text-message hotline.
The Crisis Text Line can be reached by texting HOME to **741-741**.

Samaritans USA (http://www.samaritansusa.org/) is a registered charity aimed at providing emotional support to anyone in distress or at risk of suicide throughout the United States.

The Trevor Project (http://www.thetrevorproject.org/) is a nationwide organization that provides a 24-hour phone hotline, as well as limited-hour webchat and text options, for lesbian, gay, bisexual, transgender and questioning youth.
The TrevorLifeline can be reached at **1-866-488-7386**.

The Trans Lifeline can be reached at **1-877-565-8860**.` 
    };
    default:
      return { 
        country: result, 
        text: `That country couldn't be found`
      };
  }
};
