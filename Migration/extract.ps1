class DMDExport {
    [string]$Brand
    [string]$datafolder="data\"
    [string]$Model
    [string]$VendorSku

    [string]ToString(){
        return ("{0}|{1}|{2}" -f $this.Brand, $this.Model, $this.VendorSku)
    }
    [string]RequestDataFromFirebase($table, $url){
        
        $response = Invoke-WebRequest -Method Get -Uri $url -ErrorAction Stop
        if ($response.statuscode -eq '200') {
            Write-output "que tiene "
            $resp = $response.Content.Replace('\n','xXXXXX')
            ( $response.Content | ConvertTo-Json -Depth 100 -Compress | Out-File "$pwd\$($this.datafolder)$($table).json")
        }else{
            Write-output "Algo anda MAl revisar el URL"
        }
        return  Write-output "que tiene " $response.Content
    }

}
class DMDImport {
    [string]$Brand
    [string]$Model
    [string]$VendorSku

    [string]ToString(){
        return ("{0}|{1}|{2}" -f $this.Brand, $this.Model, $this.VendorSku)
    }
}
class DMDMigration {
    [int]$Slots = 8
    [string]$Brand
    [string]$Model
    [string]$VendorSku
    [string]$AssetId
    [DMDExport[]]$DMDExport = [DMDExport[]]::new($this.Slots)
    [DMDImport[]]$DMDImport = [DMDImport[]]::new($this.Slots)

    [void] AddDevice([DMDExport]$dev, [int]$slot){
        ## Add argument validation logic here
        $this.DMDExport[$slot] = $dev
    }

    [void]RemoveDevice([int]$slot){
        ## Add argument validation logic here
        $this.DMDExport[$slot] = $null
    }

    [int[]] GetAvailableSlots(){
        [int]$i = 0
        return @($this.DMDExport.foreach{ if($_ -eq $null){$i}; $i++})
    }
}
$migration = [DMDMigration]::new()

$export = [DMDExport]::new()
$export.Brand = "Microsoft"
$export.Model = "Surface Pro 4"
$export.VendorSku = "5072641000"

#$migration.AddDevice($export, 2)

$export.RequestDataFromFirebase("contacts","")

#migration
#$migration.GetAvailableSlots()

