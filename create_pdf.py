from reportlab.pdfgen import canvas
c = canvas.Canvas('sample.pdf')
c.drawString(100,750,'1. This is a test clause. It mentions GDPR compliance.')
c.drawString(100,730,'2. Another clause with HIPAA concerns.')
c.save()
print('sample.pdf created')
