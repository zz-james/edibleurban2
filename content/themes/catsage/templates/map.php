<?php use Roots\Sage\Titles; ?>

<div class="flex_container">
    <div class="info_container">
        <div class="info_display" style="overflow-y: scroll">
            <div class="page-header">
                <h3><?= Titles\title(); ?></h3>
            </div>
            <div class="intro-text well">
                <p>Currently, this page features an interactive and participatory map of the potential for urban agriculture in peterborough, UK. This will son be expanded to included other cities. The purpose of the map is to collected data on land availability in cities to grow&nbsp;food. For example, mapping rooftops, tarmac, vacant lots, underused grass, land around housing. Users can also suggest an alternative food producing use for these spaces.&nbsp;Most people think there isn’t any land available in cities to grow substantial food; this map aims to prove them wrong.&nbsp;This map is a new idea for me and begins with peterborough in the UK.</p>
                <p><strong>If you wish to take part in adding to this map, please log in and get a password. After this you can begin to draw on the map, adding land type, descriptions, and suggested food producing uses.</strong></p>
                <button class="intro-text_close_open button btn-default">
                    <span class="glyphicon glyphicon-remove" aria-hidden="true"></span><span class="text"> Close</span>
                </button>
            </div>

        </div>
        <div class="map_key" >
        <table width="100%" cellpadding="10" border="1">
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
            </tbody>
        </table>

        </div>
    </div>

    <div class="map_container">
        <div id="map" style="height: 512px"></div>
    </div>
</div>