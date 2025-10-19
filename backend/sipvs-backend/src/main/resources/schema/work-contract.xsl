<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:w="http://example.com/work-contract"
  exclude-result-prefixes="w">

<xsl:output method="html" encoding="UTF-8" indent="yes"/>

<xsl:template match="/w:workContract">
  <html>
    <head>
      <meta charset="UTF-8"/>
      <title>Pracovná zmluva</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #ffffff;
          color: #000000;
          padding: 40px;
          line-height: 1.6;
        }
        h1 {
          text-align: center;
          color: #000000;
          margin-bottom: 40px;
        }
        h2 {
          color: #000000;
          margin-top: 40px;
          border-bottom: 1px solid #000000;
          padding-bottom: 5px;
        }
        p {
          margin: 6px 0;
        }
        .label {
          font-weight: bold;
          color: #000000;
        }
        .section {
          margin-bottom: 30px;
        }
      </style>
    </head>

    <body>
      <h1>Pracovná zmluva</h1>

      <div class="section">
        <h2>Údaje o zamestnancovi</h2>
        <p><span class="label">Meno a priezvisko:</span> <xsl:value-of select="w:employee/w:name"/></p>
        <p><span class="label">Dátum narodenia:</span> <xsl:value-of select="w:employee/w:birthDate"/></p>
        <p><span class="label">Adresa:</span> <xsl:value-of select="w:employee/w:adresa"/></p>
        <p><span class="label">E-mail:</span> <xsl:value-of select="w:employee/w:email"/></p>
        <p><span class="label">Telefónne číslo:</span> <xsl:value-of select="w:employee/w:phone"/></p>
      </div>

      <div class="section">
        <h2>Údaje o zamestnávateľovi</h2>
        <p><span class="label">Názov spoločnosti:</span> <xsl:value-of select="w:company/w:companyName"/></p>
        <p><span class="label">Sídlo spoločnosti:</span> <xsl:value-of select="w:company/w:companyAdresa"/></p>
        <p><span class="label">Kontaktná osoba:</span> <xsl:value-of select="w:company/w:contactInfo"/></p>
      </div>

      <div class="section">
        <h2>Pracovné údaje</h2>
        <p><span class="label">Pozícia:</span> <xsl:value-of select="w:job/w:positionTitle"/></p>
        <p><span class="label">Typ úväzku:</span> <xsl:value-of select="w:job/w:jobType"/></p>
        <p><span class="label">Miesto výkonu práce:</span> <xsl:value-of select="w:job/w:placeOfWork"/></p>
        <p><span class="label">Dátum nástupu:</span> <xsl:value-of select="w:job/w:startDate"/></p>
        <p><span class="label">Mzda:</span> <xsl:value-of select="w:job/w:salary"/> €</p>
      </div>

      <div class="section">
        <h2>Povinnosti zamestnanca</h2>
        <xsl:for-each select="w:duties/w:duty">
          <p>– <xsl:value-of select="."/></p>
        </xsl:for-each>
      </div>
    </body>
  </html>
</xsl:template>

</xsl:stylesheet>
