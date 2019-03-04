'Yearly change from what the stock opened the year at to what the closing price was.
'The percent change from the what it opened the year at to what it closed.
'The total Volume of the stock
'Ticker symbol
'You should also have conditional formatting that will highlight positive 
'change in green and negative change in red.

Sub Stock_moderate()

For Each ws In Worksheets

Dim Ticker_Volume As Long
Dim table_summary As Integer
Dim opening_price As Double
Dim closing_price As Double
Dim Yearly_Change As Double

Ticker_Volume = 0
table_summary = 2

lastrow = ws.Cells(Rows.Count, 1).End(xlUp).Row

ws.Cells(1, 9) = "Ticker"
ws.Cells(1, 10) = "Yearly Change"
ws.Cells(1, 11) = "Percent Change"
ws.Cells(1, 12) = "Total Stock Volume"

'save off the opening price of the year for the first ticket
opening_price = ws.Cells(2, 3)

'loop through all rows, find where the ticker changes
For i = 2 To lastrow
    If ws.Cells(i + 1, 1) = ws.Cells(i, 1) Then
        Ticker_Volume = Ticker_Volume + ws.Cells(i, 3)
        'accumulate total volume
    Else
        'print out total volume and ticker name in summary table
        ws.Cells(table_summary, 9) = ws.Cells(i, 1)
        ws.Cells(table_summary, 12) = Ticker_Volume + ws.Cells(i, 3)
        
        'reset volume for change in ticker
        Ticker_Volume = 0
        
        'save closing price at the end of the year
        closing_price = ws.Cells(i, 3)
        
        'Save of Yearly Change be subracting opening from closing price
        Yearly_Change = closing_price - opening_price
        ws.Cells(table_summary, 10) = Yearly_Change
        
        'Color format Yearly Change
        If Yearly_Change >= 0 Then
            ws.Cells(table_summary, 10).Interior.ColorIndex = 4
        Else
            ws.Cells(table_summary, 10).Interior.ColorIndex = 3
        End If
        
        'Percent Change- since some opening and closing prices are zero- error / 0
        'Requires if statement
        If opening_price = 0 Then
            ws.Cells(table_summary, 11) = 0
        Else
            ws.Cells(table_summary, 11) = Yearly_Change / opening_price
            ws.Cells(table_summary, 11) = Format(ws.Cells(table_summary, 11), "Percent")
        End If
        
        'move the table summary down by one for thet next ticker
        table_summary = table_summary + 1
        
         'save of next ticker opening price
        opening_price = ws.Cells(i + 1, 3)
        
    End If
Next i

'AutoFit columns in each sheet so headers a visible
ws.Cells.EntireColumn.AutoFit

Next ws

End Sub