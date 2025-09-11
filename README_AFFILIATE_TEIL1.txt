📈 Affiliate-System – Teil 1:
- Modell: AffiliateLink (seedbank, url, affiliateId, timestamps)
- Controller:
  • listAffiliateLinks: GET /affiliate-links
  • createAffiliateLink: POST /affiliate-links
  • updateAffiliateLink: PUT /affiliate-links/:id
  • deleteAffiliateLink: DELETE /affiliate-links/:id
- Auth + Rolle 'admin' erforderlich
- Nutzung: Frontend ruft GET /affiliate-links, matcht seedbank → url bei Kauf-Links