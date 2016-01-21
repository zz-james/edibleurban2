<?php use Roots\Sage\Titles; ?>

<div class="flex_container">
    <div class="info_container">
        <h1><?= Titles\title(); ?></h1>
        <div>
        <table width="100%" cellpadding="10" border="1" style="margin-bottom: 5px">
        <tbody>
        <tr>
           <td width="50px" style="background:#96c25d"></td>
           <td align="left" style="padding-left:2px">Green Space</td>
        </tr>
        <tr>
          <td width="50px" style="background:#d28cba"></td>
          <td align="left" style="padding-left:2px">Indoor Space</td>
        </tr>
        <tr>
           <td width="50px" style="background:#eac1c0"></td>
           <td align="left" style="padding-left:2px">Pavement or pedestrian area</td>
        </tr>
        <tr>
           <td width="50px" style="background:#eaaf24"></td>
            <td align="left" style="padding-left:2px">Public Space</td>
        </tr>
        <tr>
           <td width="50px" style="background:#aedce7"></td>
           <td align="left" style="padding-left:2px">Rooftop</td>
        </tr>
        <tr>
            <td width="50px" style="background:#f4cda3"></td>
            <td align="left" style="padding-left:2px">Tarmac</td>
        </tr>
        <tr>
            <td width="50px" style="background:#858e93"></td>
            <td align="left" style="padding-left:2px">Vacant Land</td>
        </tr>
</tbody></table>

        </div>
    </div>

    <div class="map_container">
        <div id="map" style="height: 512px"></div>
    </div>
</div>