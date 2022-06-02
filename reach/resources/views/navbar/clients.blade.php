<div class="tab-pane show active" id="pills-chat" role="tabpanel">
    <!-- Start chats content -->
    <div>
        <div class="px-4 pt-4">
            <div class="d-flex align-items-start">
                <div class="flex-grow-1">
                    <h4 class="mb-4">
                        Client Chat page
                    </h4>
                </div>
            </div>
            <form>
                <div class="input-group search-panel mb-3">
                    <input type="text" class="form-control bg-light border-0" id="searchChatUser" v-model="searchClient"
                        title="Enter something to search a client" placeholder="Enter client Id to search" autocomplete="off">
                    <button class="btn btn-light p-0" type="button" id="searchbtn-addon"><i
                            class='bx bx-search align-middle'></i></button>
                </div>
            </form>
        </div> 

        <div data-simplebar>

            <div class="d-flex align-items-center px-4 mt-4 mb-4">
                <div class="flex-grow-1">
                    <h5 class="mb-0 fs-11 text-muted text-uppercase">Client List</h5>
                </div>
            </div>

            <div class="chat-message-list">
                <ul class="list-unstyled chat-list chat-user-list mb-3" id="channelList">

                    <li class="chat-message-item pb-3"  @click="selectClient(client)" v-for="client in resultClientSearch" 
                    v-bind:id="client.clientId" :class="[client.clientId == selectedClientId ? 'selected-client' : '']">  
                                  
                        <a href="javascript:" >   
                            <img src="/assets/images/online.png" width="16" class="mx-3" v-show="isClientOnline(client.clientId)">                   
                            <img src="/assets/images/offline.png" width="16" class="mx-3" v-show="!isClientOnline(client.clientId)"> 
                            @{{ client.domain }} - @{{ client.ipaddress }}          
                        </a>  

                        <a href="javascript:" class="client-info" @click="viewClientInfo(client)" title="Click to view client details">
                            <i class="ri-information-line"></i> 
                        </a>
                    </li>

                    <li class="text-center" v-show="resultClientSearch.length == 0">
                        --- Client result is empty ---
                    </li>

                </ul>
            </div>
        </div>
    </div>
</div>



<!-- View client Info -->
<div class="modal fade" id="view-client-modal" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content modal-header-colored border-0">
            <div class="modal-header">
                <h5 class="modal-title text-white fs-16">
                    Info - @{{ viewClient.domain }} / @{{ viewClient.ipaddress }} 
                </h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" ></button>
            </div>

            <div class="modal-body p-4">
                <div class="table-responsive mt-3">
                    <table class="table table-editable table-nowrap align-middle table-edits">
                        <tbody>
                            <tr>
                                <th>Client Id</th>
                                <td>@{{ viewClient.clientId }} </td>
                            </tr>   
                            <tr>
                                <th>IP Address</th>
                                <td>@{{ viewClient.ipaddress }} </td>
                            </tr>
                            <tr>
                                <th>Domain</th>
                                <td>@{{ viewClient.domain }} </td>
                            </tr>
                            <tr>
                                <th>Country</th>
                                <td>@{{ viewClient.country }} </td>
                            </tr>
                            <tr>
                                <th>City</th>
                                <td>@{{ viewClient.city }} </td>
                            </tr>              
                        </tbody>
                    </table>

                    <div class="row">
                        <div class="col-sm-6">
                            Allow Client Upload
                        </div>
                        <div class="col-sm-6">

                        </div>

                        <div class="col-sm-6">
                            Block Client IP
                        </div>
                        <div class="col-sm-6">

                        </div>

                        <div class="col-sm-6">
                            End Session
                        </div>
                        <div class="col-sm-6">

                        </div>
                    </div>


                </div>

            </div>
        </div>
    </div>
</div>
